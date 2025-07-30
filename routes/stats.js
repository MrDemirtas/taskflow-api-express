const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getStatusDistribution,
  getUserWorkload,
  getAverageCompletionTime,
  getCompletedTaskWeekly,
  getCompletedTaskDaily,
  getUpcomingDeadlines,
} = require("../controllers/statsController");

router.use(protect);

router.get("/status-distribution", getStatusDistribution);
router.get("/user-workload", getUserWorkload);
router.get("/avg-completion-time", getAverageCompletionTime);
router.get("/completed-weekly", getCompletedTaskWeekly);
router.get("/completed-daily", getCompletedTaskDaily);
router.get("/upcoming-deadlines", getUpcomingDeadlines);

module.exports = router;
