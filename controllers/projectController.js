const Project = require("../models/Project");

exports.getProjects = async (req, res) => {
  const { sort = "-createdAt", page = 1, limit = 10 } = req.query;
  try {
    const projects = await Project.find({ owner: req.user._id })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("owner", "name");

    const total = await Project.countDocuments({ owner: req.user._id });

    res.json({
      projects,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Proje alma hatası" });
  }
};

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Proje oluşturma hatası" });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findOne({ _id: id, owner: req.user._id });

    if (!project) return res.status(404).json({ message: "Proje bulunamadı" });

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Proje güncellenme hatası" });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!project) return res.status(404).json({ message: "Proje bulunamadı" });

    res.json({ message: "Proje silindi" });
  } catch (error) {
    res.status(500).json({ message: "Proje silinme hatası" });
  }
};
