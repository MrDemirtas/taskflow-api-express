const Task = require("../models/Task");
const Project = require("../models/Project");

exports.getTasks = async (req, res) => {
  const { status, priority, sort = "-createdAt", page = 1, limit = 10 } = req.query;

  const query = { owner: req.user._id };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  try {
    const tasks = await Task.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("project")
      .populate("owner", "name");

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      limit: Number(limit),
      page: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Görevleri alma hatası" });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, priority, estimateHours, project } = req.body;

  try {
    const ownedProject = await Project.findOne({
      _id: project,
      owner: req.user._id,
    });
    if (!ownedProject) return res.status(400).json({ message: "Proje bulunamadı veya yetkisiz" });

    const now = new Date();
    const deadlineDate = new Date(now.setHours(now.getHours() + estimateHours));

    const task = await Task.create({
      title,
      description,
      status: "todo",
      priority,
      estimateHours,
      dueDate: null,
      deadlineDate,
      project,
      owner: req.user._id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Görev oluşturma hatası", error });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) return res.status(404).json({ message: "Görev bulunamadı" });

    const createdAt = new Date(task.createdAt);
    let deadlineDate = task.deadlineDate;
    if (req.body.estimateHours) {
      deadlineDate = new Date(createdAt.setHours(createdAt.getHours() + req.body.estimateHours));
    }

    Object.assign(task, {
      ...req.body,
      dueDate: req.body.status === "done" ? new Date() : null,
      deadlineDate,
    });
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Görev güncellenme hatası", error });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });

    if (!task) return res.status(404).json({ message: "Görev bulunamadı" });

    res.json({ message: "Görev silindi" });
  } catch (error) {
    res.status(500).json({ message: "Görev silinme hatası" });
  }
};
