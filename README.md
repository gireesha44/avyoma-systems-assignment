# ⚡ TaskFlow — Task Management Web Application

TaskFlow is a modern, responsive full-stack task management web application built to create, view, edit, filter, and track daily tasks and workflows with persistence and input validation.

---

## 🚀 Key Features

* **Task Management (CRUD)**:
  * **Add New Tasks**: Create tasks with Title, Description, Priority level (*Low*, *Medium*, *High*), and optional Due Date.
  * **View All Tasks**: Interactive task dashboard displaying task cards with priority badges, status indicators, and due dates.
  * **Edit Tasks**: Update existing task details in a responsive modal dialog.
  * **Delete Tasks**: Remove individual tasks with confirmation dialogs or clear all completed tasks in one click.
  * **Mark Completion**: Toggle task status seamlessly between **Pending** and **Completed** with immediate visual feedback.
* **Filtering, Searching & Sorting**:
  * **Status Tabs**: Filter by *All*, *Pending*, or *Completed*.
  * **Search Bar**: Real-time filtering by title or description substring.
  * **Priority Filter**: Filter tasks by priority (*Low*, *Medium*, *High*).
  * **Sorting**: Sort tasks by Date Created, Due Date, Title (A-Z), or Priority.
* **Metrics & Progress Tracking**:
  * Visual overview cards (Total, Completed, Pending, High Priority tasks).
  * Animated progress bar showing overall completion rate.
* **User Experience & Design**:
  * Glassmorphism dark Slate aesthetic with responsive grid layout.
  * Theme switcher (Dark / Light mode support).
  * Real-time toast feedback notifications.
  * Client & Server side input validation with field-level error messaging.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Fast component rendering, state hooks & responsive layout |
| **Icons & Typography** | Lucide React, Google Fonts | Inter & Outfit typography, modern UI icons |
| **Styling** | Vanilla CSS | CSS variables, glassmorphism, responsive breakpoints |
| **Backend** | Node.js / Express | Modular RESTful API server |
| **Database** | SQLite3 | Local SQL file-based database (`tasks.db`) for persistent storage |
| **Validation** | Express Validator | Server-side payload validation & error handling |
| **Concurrency** | Concurrently | Run backend & frontend simultaneously with one command |

---

## 📁 Project Structure

```
avyoma/
├── backend/
│   ├── data/               # SQLite database file (tasks.db)
│   ├── src/
│   │   ├── controllers/    # Task CRUD business logic
│   │   ├── middleware/     # Input validation middleware (express-validator)
│   │   ├── routes/         # Express API route endpoints
│   │   ├── db.js           # SQLite connection & schema initialization
│   │   └── index.js        # Express server entry point (Port 5000)
│   ├── test/               # Automated integration tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Fetch wrapper for REST API endpoints
│   │   ├── components/     # Reusable React components (TaskCard, FilterBar, TaskStats, TaskFormModal, ToastContainer)
│   │   ├── App.jsx         # Main application container & state logic
│   │   ├── index.css       # Design tokens, themes & layout styles
│   │   └── main.jsx        # React root entry point
│   ├── index.html
│   ├── vite.config.js      # Vite build & dev server config (Proxy to backend)
│   └── package.json
│
├── package.json            # Root script runner for concurrent dev start
├── test-runner.js          # Root test script runner
└── README.md               # Project documentation
```

---

## 📡 REST API Documentation

Base Endpoint: `http://localhost:5000/api/tasks`

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch tasks with filters | Query: `status`, `search`, `priority`, `sortBy`, `order` |
| `GET` | `/api/tasks/:id` | Get single task details | Params: `id` |
| `POST` | `/api/tasks` | Create a new task | Body: `{ title*, description, status, priority, dueDate }` |
| `PUT` | `/api/tasks/:id` | Update task details | Body: `{ title, description, status, priority, dueDate }` |
| `PATCH` | `/api/tasks/:id/status` | Toggle or update status | Body: `{ status }` |
| `DELETE` | `/api/tasks/:id` | Delete a task | Params: `id` |
| `DELETE` | `/api/tasks/completed` | Clear all completed tasks | None |

### Sample `POST /api/tasks` Request Body:
```json
{
  "title": "Setup CI/CD Pipeline",
  "description": "Configure GitHub Actions workflow for automated testing.",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-09-30"
}
```

### Sample Response:
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "title": "Setup CI/CD Pipeline",
    "description": "Configure GitHub Actions workflow for automated testing.",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-09-30",
    "createdAt": "2026-09-12 00:28:00",
    "updatedAt": "2026-09-12 00:28:00"
  }
}
```

---

## ⚡ Step-by-Step Local Setup & Execution Guide

### Prerequisites
* **Node.js** (v18+ recommended, v24 supported)
* **npm** (v9+)

### 1. Install Dependencies
Run the following command at the root directory to install dependencies for root, backend, and frontend:
```bash
npm run install-all
```
*(Alternatively, you can `cd backend && npm install` and `cd frontend && npm install` manually).*

### 2. Run Application (Concurrent Backend & Frontend)
To launch both the Node.js/Express backend server and the React Vite frontend concurrently with a single command:
```bash
npm run dev
```

* **Frontend App**: `http://localhost:3000` (or `http://localhost:5173`)
* **Backend API**: `http://localhost:5000/api/tasks`

### 3. Run Integration Tests
To test the REST API endpoints automatically:
```bash
npm test
```

---

## 🔒 Input Validation & Error Handling

1. **Client-side Validation**:
   - Immediate title field requirement check before dispatching requests.
   - User feedback via toast alert messages for network or request errors.
2. **Server-side Validation**:
   - `express-validator` middleware sanitizes and validates requests.
   - Title: Required non-empty string, 1 to 150 characters.
   - Priority: Enforces `['low', 'medium', 'high']`.
   - Status: Enforces `['pending', 'completed']`.
   - Returns structured `HTTP 400 Bad Request` with field-specific error details.
3. **Database Error Safety**:
   - Handles missing IDs with `HTTP 404 Not Found`.
   - Safe parameter binding prevents SQL Injection attacks.

---

## 📦 Submission Details
* Code is structured cleanly into modular backend and frontend folders.
* Persistent SQLite database auto-seeds sample tasks on first launch.
