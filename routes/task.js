const express = require("express");
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { validateTaskQuery, validateTaskBodyPost, validateTaskBodyPut, validateTaskId } = require("../validations/task");
const protect = require("../middleware/auth");

router.use(protect);

router.get("/", validateTaskQuery(), getTasks);
router.post("/", validateTaskBodyPost(), createTask);
router.put("/:id", validateTaskBodyPut(), updateTask);
router.delete("/:id", validateTaskId(), deleteTask);

module.exports = router;
