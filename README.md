# Task Manager

A simple Task Manager project using React, JavaScript (Node.js + Express), and MySQL.

## Tech stack
- Frontend: React, HTML, CSS, Vite
- Backend: JavaScript, Node.js, Express.js
- Database: MySQL
- MySQL driver: mysql2

## Requirements
Install Node.js (LTS) and MySQL Server. MySQL Workbench is optional but useful.

## Setup
1. In MySQL Workbench, open and run `backend/schema.sql`.
2. Copy `backend/.env.example` to `backend/.env` and enter your MySQL password.
3. Open a terminal in the root `Task-Manager` folder and run:
   ```bash
   npm install
   npm run install:all
   npm run dev
   ```
4. Open http://localhost:5173 in your browser.

Features: add tasks, list tasks, mark tasks complete/pending, and delete tasks. Tasks are saved in MySQL.
