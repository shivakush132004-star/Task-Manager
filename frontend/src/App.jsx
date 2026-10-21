import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load tasks.");
      setTasks(await response.json());
      setError("");
    } catch {
      setError("Cannot connect to the backend. Check that Node.js and MySQL are running.");
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not add task.");
      setTasks(current => [data, ...current]);
      setTitle("");
      setError("");
    } catch (err) { setError(err.message); }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !Boolean(task.completed) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not update task.");
      setTasks(current => current.map(item => item.id === task.id ? data : item));
      setError("");
    } catch (err) { setError(err.message); }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete task.");
      setTasks(current => current.filter(task => task.id !== id));
      setError("");
    } catch (err) { setError(err.message); }
  }

  const completedCount = tasks.filter(task => Boolean(task.completed)).length;

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">PLAN YOUR DAY</p>
        <h1>Task Manager</h1>
        <p className="subtitle">Keep track of what you need to do.</p>
        <div className="stats">
          <div><strong>{tasks.length}</strong><span>Total</span></div>
          <div><strong>{completedCount}</strong><span>Completed</span></div>
          <div><strong>{tasks.length - completedCount}</strong><span>Pending</span></div>
        </div>
        <form onSubmit={addTask}>
          <input value={title} onChange={event => setTitle(event.target.value)} placeholder="Enter a task..." maxLength={255} required />
          <button type="submit">Add task</button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
        <h2>My tasks</h2>
        {tasks.length === 0 ? <p className="empty">No tasks yet. Add your first task above.</p> : (
          <ul>
            {tasks.map(task => (
              <li key={task.id}>
                <label className={Boolean(task.completed) ? "done" : ""}>
                  <input type="checkbox" checked={Boolean(task.completed)} onChange={() => toggleTask(task)} />
                  <span>{task.title}</span>
                </label>
                <button className="delete" onClick={() => deleteTask(task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
        <footer>Saved in your MySQL database</footer>
      </section>
    </main>
  );
}
