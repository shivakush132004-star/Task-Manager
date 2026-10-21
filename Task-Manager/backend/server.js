require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/tasks", async (_req, res) => {
  try {
    const [tasks] = await db.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(tasks);
  } catch (error) {
    console.error("Fetch tasks:", error.message);
    res.status(500).json({ message: "Could not load tasks. Check MySQL configuration." });
  }
});

app.post("/api/tasks", async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  if (!title) return res.status(400).json({ message: "Task title is required." });
  try {
    const [result] = await db.execute("INSERT INTO tasks (title) VALUES (?)", [title]);
    const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Add task:", error.message);
    res.status(500).json({ message: "Could not add task." });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || typeof req.body.completed !== "boolean") {
    return res.status(400).json({ message: "Invalid task ID or completion value." });
  }
  try {
    const [result] = await db.execute("UPDATE tasks SET completed = ? WHERE id = ?", [req.body.completed, id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Task not found." });
    const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Update task:", error.message);
    res.status(500).json({ message: "Could not update task." });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid task ID." });
  try {
    const [result] = await db.execute("DELETE FROM tasks WHERE id = ?", [id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task deleted." });
  } catch (error) {
    console.error("Delete task:", error.message);
    res.status(500).json({ message: "Could not delete task." });
  }
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`Task Manager API running at http://localhost:${port}`));
