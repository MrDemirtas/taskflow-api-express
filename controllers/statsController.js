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

// 2. Kullanıcı İş Yükü (Toplam görev sayısı)
exports.getUserWorkload = async (req, res) => {
  const total = await Task.countDocuments({ owner: req.user._id });
  res.json({ total });
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

// 4.  Haftalık Tamamlanan Görev Sayısı
exports.getCompletedTaskWeekly = async (req, res) => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
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
    data,
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
      tasks: upcomingTasks,
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
