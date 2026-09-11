import { dbAll, dbGet, dbRun } from '../db.js';

// GET /api/tasks - Retrieve all tasks with filtering, search, and sorting
export const getTasks = async (req, res) => {
  try {
    const { status, search, priority, sortBy = 'createdAt', order = 'DESC' } = req.query;
    
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status && ['pending', 'completed'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Allowed sort fields
    const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const tasks = await dbAll(query, params);

    // Summary metrics for stats bar
    const statsRows = await dbAll(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN priority = 'high' AND status = 'pending' THEN 1 ELSE 0 END) as highPriority
      FROM tasks
    `);

    const stats = statsRows[0] || { total: 0, completed: 0, pending: 0, highPriority: 0 };

    res.json({
      success: true,
      count: tasks.length,
      stats: {
        total: Number(stats.total || 0),
        completed: Number(stats.completed || 0),
        pending: Number(stats.pending || 0),
        highPriority: Number(stats.highPriority || 0)
      },
      tasks
    });
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving tasks', error: error.message });
  }
};

// GET /api/tasks/:id - Retrieve single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);

    if (!task) {
      return res.status(404).json({ success: false, message: `Task with ID ${id} not found` });
    }

    res.json({ success: true, task });
  } catch (error) {
    console.error('Error in getTaskById:', error);
    res.status(500).json({ success: false, message: 'Server error fetching task', error: error.message });
  }
};

// POST /api/tasks - Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description = '', status = 'pending', priority = 'medium', dueDate = null } = req.body;

    const result = await dbRun(
      `INSERT INTO tasks (title, description, status, priority, dueDate, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [title.trim(), description.trim(), status, priority, dueDate || null]
    );

    const newTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [result.id]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
  }
};

// PUT /api/tasks/:id - Update an existing task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, message: `Task with ID ${id} not found` });
    }

    const title = req.body.title !== undefined ? req.body.title.trim() : existing.title;
    const description = req.body.description !== undefined ? req.body.description.trim() : existing.description;
    const status = req.body.status !== undefined ? req.body.status : existing.status;
    const priority = req.body.priority !== undefined ? req.body.priority : existing.priority;
    const dueDate = req.body.dueDate !== undefined ? req.body.dueDate : existing.dueDate;

    await dbRun(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?, updatedAt = datetime('now')
       WHERE id = ?`,
      [title, description, status, priority, dueDate || null, id]
    );

    const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
  }
};

// PATCH /api/tasks/:id/status - Toggle or set status (completed/pending)
export const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, message: `Task with ID ${id} not found` });
    }

    const nextStatus = req.body.status 
      ? req.body.status 
      : (existing.status === 'completed' ? 'pending' : 'completed');

    await dbRun(
      `UPDATE tasks SET status = ?, updatedAt = datetime('now') WHERE id = ?`,
      [nextStatus, id]
    );

    const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Task marked as ${nextStatus}`,
      task: updatedTask
    });
  } catch (error) {
    console.error('Error in toggleTaskStatus:', error);
    res.status(500).json({ success: false, message: 'Failed to update task status', error: error.message });
  }
};

// DELETE /api/tasks/:id - Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, message: `Task with ID ${id} not found` });
    }

    await dbRun('DELETE FROM tasks WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Task deleted successfully',
      id: Number(id)
    });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ success: false, message: 'Failed to delete task', error: error.message });
  }
};

// DELETE /api/tasks - Delete all completed tasks
export const clearCompletedTasks = async (req, res) => {
  try {
    const result = await dbRun("DELETE FROM tasks WHERE status = 'completed'");
    res.json({
      success: true,
      message: `Cleared ${result.changes} completed task(s)`,
      deletedCount: result.changes
    });
  } catch (error) {
    console.error('Error in clearCompletedTasks:', error);
    res.status(500).json({ success: false, message: 'Failed to clear completed tasks', error: error.message });
  }
};
