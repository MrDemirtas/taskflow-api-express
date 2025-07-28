const Task = require("../models/Task");

// 1. Görev Durumu Dağılımı
exports.getStatusDistribution = async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { owner: req.user._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.json({
    statusDistribution: stats,
    totalCount: stats.reduce((sum, item) => sum + item.count, 0),
  });
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

  const thisDay = await Task.find({
    owner: req.user._id,
    createdAt: { $gte: now, $lte: new Date(now).setHours(23, 59, 59, 999) },
  });
  const thisWeek = await Task.find({
    owner: req.user._id,
    createdAt: { $gte: thisWeekDate, $lte: new Date(now).setHours(23, 59, 59, 999) },
  });
  const thisMonth = await Task.find({
    owner: req.user._id,
    createdAt: { $gte: thisMonthDate, $lte: new Date(now).setHours(23, 59, 59, 999) },
  });
  const thisYear = await Task.find({
    owner: req.user._id,
    createdAt: { $gte: thisYearDate, $lte: new Date(now).setHours(23, 59, 59, 999) },
  });

  const total = await Task.find({ owner: req.user._id });
  const totalCompleted = total.filter((task) => task.status === "done").length;
  const totalNotCompleted = total.filter((task) => task.status !== "done").length;

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
        percentage: ((thisDayCompleted / thisDayNotCompleted) * 100).toFixed(2),
        count: thisDayCompleted + thisDayNotCompleted,
      },
      thisWeek: {
        completed: thisWeekCompleted,
        notCompleted: thisWeekNotCompleted,
        percentage: ((thisWeekCompleted / thisWeekNotCompleted) * 100).toFixed(2),
        count: thisWeekCompleted + thisWeekNotCompleted,
      },
      thisMonth: {
        completed: thisMonthCompleted,
        notCompleted: thisMonthNotCompleted,
        percentage: ((thisMonthCompleted / thisMonthNotCompleted) * 100).toFixed(2),
        count: thisMonthCompleted + thisMonthNotCompleted,
      },
      thisYear: {
        completed: thisYearCompleted,
        notCompleted: thisYearNotCompleted,
        percentage: ((thisYearCompleted / thisYearNotCompleted) * 100).toFixed(2),
        count: thisYearCompleted + thisYearNotCompleted,
      },
    },
    total: {
      completed: totalCompleted,
      notCompleted: totalNotCompleted,
      percentage: ((totalCompleted / totalNotCompleted) * 100).toFixed(2),
      count: totalCompleted + totalNotCompleted,
    },
  });
};

// 3. Ortalama Tamamlama Süresi
exports.getAverageCompletionTime = async (req, res) => {
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
};

// 4.  Haftalık Tamamlanan Görev Sayısı (Pazartesi-Pazar)
exports.getCompletedTaskWeekly = async (req, res) => {
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
};

exports.getCompletedTaskDaily = async (req, res) => {
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
};

// 5. Yaklaşan Deadline'lar (önümüzdeki 24 saat)
exports.getUpcomingDeadlines = async (req, res) => {
  const now = new Date();

  try {
    const tasks = await Task.find({
      owner: req.user._id,
      status: { $ne: "done" },
    })
      .sort("estimateHours")
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
