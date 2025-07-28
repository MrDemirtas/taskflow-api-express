const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const swaggerDocs = require("./swagger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB bağlantısı
connectDB();

// Rotalar
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/stats", require("./routes/stats"));

// Swagger
swaggerDocs(app);

// 404 fallback
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

module.exports = app;
