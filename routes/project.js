const express = require("express");
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController");
const protect = require("../middleware/auth");
const {
  validateProjectBodyPost,
  validateProjectBodyPut,
  validateProjectQuery,
  validateProjectId,
} = require("../validations/project");

router.use(protect); // tüm rotaları JWT ile koru

router.get("/", validateProjectQuery(), getProjects); // Tüm projeleri getir

router.post("/", validateProjectBodyPost(), createProject); // Yeni proje oluştur

router.put("/:id", validateProjectBodyPut(), updateProject); // Projeyi güncelle

router.delete("/:id", validateProjectId(), deleteProject); // Projeyi sil

module.exports = router;
