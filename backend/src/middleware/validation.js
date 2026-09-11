import { body, validationResult } from 'express-validator';

export const validateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required and cannot be empty')
    .isLength({ min: 1, max: 150 })
    .withMessage('Title must be between 1 and 150 characters'),
  
  body('description')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Description must be text')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage("Status must be either 'pending' or 'completed'"),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("Priority must be 'low', 'medium', or 'high'"),

  body('dueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO format date (YYYY-MM-DD)'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
      });
    }
    next();
  }
];

export const validateTaskUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 150 })
    .withMessage('Title must be between 1 and 150 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be text')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage("Status must be either 'pending' or 'completed'"),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("Priority must be 'low', 'medium', or 'high'"),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO format date'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
      });
    }
    next();
  }
];
