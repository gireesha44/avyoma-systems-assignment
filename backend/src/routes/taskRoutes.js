import express from 'express';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  toggleTaskStatus, 
  deleteTask,
  clearCompletedTasks
} from '../controllers/taskController.js';
import { validateTask, validateTaskUpdate } from '../middleware/validation.js';

const router = express.Router();

// Task Routes
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateTask, createTask);
router.put('/:id', validateTaskUpdate, updateTask);
router.patch('/:id/status', toggleTaskStatus);
router.delete('/completed', clearCompletedTasks);
router.delete('/:id', deleteTask);

export default router;
