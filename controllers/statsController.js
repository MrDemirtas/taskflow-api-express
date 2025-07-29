const Task = require("../models/Task");
const calculatePercentage = require("../utils/calculatePercentage");

// 1. Görev Durumu Dağılımı
exports.getStatusDistribution = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json({
      statusDistribution: stats,
      totalCount: stats.reduce((sum, item) => sum + item.count, 0),
    });
  } catch (error) {
    res.status(500).json({ message: "Görev durumu dağılımı hesaplanırken hata oluştu", error });
  }
};

// 2. Kullanıcı İş Yükü (Günlük, Haftalık, Aylık, Yıllık, Toplam)
exports.getUserWorkload = async (req, res) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const thisYearDate = new Date(now);
  thisYearDate.setFullYear(now.getFullYear());
  thisYearDate.setMonth(0);
  thisYearDate.setDate(1);
  thisYearDate.setHours(0, 0, 0, 0);
  const thisMonthDate = new Date(now);
  thisMonthDate.setMonth(now.getMonth());
  thisMonthDate.setDate(1);
  thisMonthDate.setHours(0, 0, 0, 0);
  const thisWeekDate = new Date(now);
  thisWeekDate.setDate(now.getDate() - (now.getDay() - 1));
  thisWeekDate.setHours(0, 0, 0, 0);

  try {
    const tasks = await Task.find({ owner: req.user._id });

    const thisDay = tasks.filter(
      (task) =>
        task.createdAt.getDate() === now.getDate() &&
        task.createdAt.getMonth() === now.getMonth() &&
        task.createdAt.getFullYear() === now.getFullYear()
    );
    const thisWeek = tasks.filter(
      (task) =>
        task.createdAt.getDate() >= thisWeekDate.getDate() &&
        task.createdAt.getDate() <= now.getDate() &&
        task.createdAt.getMonth() === now.getMonth() &&
        task.createdAt.getFullYear() === now.getFullYear()
    );
    const thisMonth = tasks.filter(
      (task) => task.createdAt.getMonth() === now.getMonth() && task.createdAt.getFullYear() === now.getFullYear()
    );
    const thisYear = tasks.filter((task) => task.createdAt.getFullYear() === now.getFullYear());

    const totalCompleted = tasks.filter((task) => task.status === "done").length;
    const totalNotCompleted = tasks.filter((task) => task.status !== "done").length;

    const thisDayCompleted = thisDay.filter((task) => task.status === "done").length;
    const thisDayNotCompleted = thisDay.filter((task) => task.status !== "done").length;
    const thisWeekCompleted = thisWeek.filter((task) => task.status === "done").length;
    const thisWeekNotCompleted = thisWeek.filter((task) => task.status !== "done").length;
    const thisMonthCompleted = thisMonth.filter((task) => task.status === "done").length;
    const thisMonthNotCompleted = thisMonth.filter((task) => task.status !== "done").length;
    const thisYearCompleted = thisYear.filter((task) => task.status === "done").length;
    const thisYearNotCompleted = thisYear.filter((task) => task.status !== "done").length;

    res.json({
      workload: {
        thisDay: {
          completed: thisDayCompleted,
          notCompleted: thisDayNotCompleted,
          percentage: calculatePercentage(thisDayCompleted, thisDayNotCompleted),
          count: thisDayCompleted + thisDayNotCompleted,
        },
        thisWeek: {
          completed: thisWeekCompleted,
          notCompleted: thisWeekNotCompleted,
          percentage: calculatePercentage(thisWeekCompleted, thisWeekNotCompleted),
          count: thisWeekCompleted + thisWeekNotCompleted,
        },
        thisMonth: {
          completed: thisMonthCompleted,
          notCompleted: thisMonthNotCompleted,
          percentage: calculatePercentage(thisMonthCompleted, thisMonthNotCompleted),
          count: thisMonthCompleted + thisMonthNotCompleted,
        },
        thisYear: {
          completed: thisYearCompleted,
          notCompleted: thisYearNotCompleted,
          percentage: calculatePercentage(thisYearCompleted, thisYearNotCompleted),
          count: thisYearCompleted + thisYearNotCompleted,
        },
      },
      total: {
        completed: totalCompleted,
        notCompleted: totalNotCompleted,
        percentage: calculatePercentage(totalCompleted, totalNotCompleted),
        count: totalCompleted + totalNotCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "İş yükü hesaplanırken hata oluştu", error });
  }
};

// 3. Ortalama Tamamlama Süresi
exports.getAverageCompletionTime = async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.user._id,
      status: "done",
      dueDate: { $ne: null },
    });

    const durations = tasks.map((task) => {
      const duration = new Date(task.dueDate) - new Date(task.createdAt);
      return duration / (1000 * 60 * 60); // saat cinsinden
    });

    const avg = durations.length
      ? (durations.reduce((sum, duration) => sum + duration, 0) / durations.length).toFixed(2)
      : 0;

    res.json({ avgHoursToComplete: avg });
  } catch (error) {
    res.status(500).json({ message: "Ortalama tamamlama süresi hesaplanırken hata oluştu", error });
  }
};

// 4.  Haftalık Tamamlanan Görev Sayısı (Pazartesi-Pazar)
exports.getCompletedTaskWeekly = async (req, res) => {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (new Date().getDay() - 1));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date();
    weekEnd.setHours(23, 59, 59, 999);

    const data = await Task.aggregate([
      {
        $match: {
          owner: req.user._id,
          status: "done",
          dueDate: { $gte: weekStart, $lte: weekEnd },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d-%m-%Y", date: "$dueDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      completedWeekly: data,
      weeklyCount: data.reduce((sum, item) => sum + item.count, 0),
    });
  } catch (error) {
    res.status(500).json({ message: "Haftalık tamamlanan görev sayısı hesaplanırken hata oluştu", error });
  }
};

exports.getCompletedTaskDaily = async (req, res) => {
  try {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date();
    dayEnd.setHours(23, 59, 59, 999);

    const data = await Task.aggregate([
      {
        $match: {
          owner: req.user._id,
          status: "done",
          dueDate: { $gte: dayStart, $lte: dayEnd },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d-%m-%Y", date: "$dueDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Günlük tamamlanan görev sayısı hesaplanırken hata oluştu", error });
  }
};

// 5. Yaklaşan Deadline'lar (önümüzdeki 24 saat)
exports.getUpcomingDeadlines = async (req, res) => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      owner: req.user._id,
      status: { $ne: "done" },
    })
      .sort("deadlineDate")
      .populate("project")
      .populate("owner", "name");

    const upcomingTasks = tasks.filter((task) => (task.deadlineDate - now) / (1000 * 60 * 60) <= 24);

    res.json({
      upcomingTasks: upcomingTasks,
      priorities: {
        low: upcomingTasks.filter((task) => task.priority === "low").length,
        medium: upcomingTasks.filter((task) => task.priority === "medium").length,
        high: upcomingTasks.filter((task) => task.priority === "high").length,
      },
      total: upcomingTasks.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Görevleri getirme hatası", error });
  }
};
