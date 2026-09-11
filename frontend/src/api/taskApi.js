const API_BASE_URL = '/api/tasks';

async function handleResponse(res, defaultErrorMsg) {
  let data;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}: Unable to reach backend service`);
    }
    throw new Error('Invalid JSON response received from server');
  }

  if (!res.ok) {
    const errorMsg = data.errors ? data.errors.map(e => e.message).join(', ') : data.message;
    throw new Error(errorMsg || defaultErrorMsg);
  }
  return data;
}

export const taskApi = {
  // Fetch all tasks with optional filters
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);

    const res = await fetch(`${API_BASE_URL}?${query.toString()}`);
    return await handleResponse(res, 'Failed to fetch tasks');
  },

  // Create a task
  async createTask(taskData) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return await handleResponse(res, 'Failed to create task');
  },

  // Update a task
  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return await handleResponse(res, 'Failed to update task');
  },

  // Toggle status
  async toggleStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await handleResponse(res, 'Failed to toggle status');
  },

  // Delete a task
  async deleteTask(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(res, 'Failed to delete task');
  },

  // Clear completed tasks
  async clearCompleted() {
    const res = await fetch(`${API_BASE_URL}/completed`, {
      method: 'DELETE'
    });
    return await handleResponse(res, 'Failed to clear completed tasks');
  }
};
