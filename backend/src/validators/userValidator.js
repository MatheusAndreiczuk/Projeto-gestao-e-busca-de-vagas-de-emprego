const { body } = require('express-validator');

const validateUserCreation = [
  body('name').isString().isLength({ min: 4, max: 150 }).withMessage('Name must be between 4 and 150 characters'),
  body('username').isString().isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username must not contain special characters or spaces'),
  
  body('password')
    .isString()
    .isLength({ min: 3, max: 20 }).withMessage('Password must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Password must not contain special characters or spaces'),
  
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Must be a valid email address'),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^\d{10,14}$/)
    .withMessage('Phone must contain only digits and be between 10 and 14 digits'),
  body('experience').optional({ checkFalsy: true }).isString().isLength({ min: 10, max: 600 }),
  body('education').optional({ checkFalsy: true }).isString().isLength({ min: 10, max: 600 }),
];

const validateUserUpdate = [
  body('name').optional().isString().isLength({ min: 4, max: 150 }),

  body('password')
    .isString()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Password must not contain special characters or spaces'),

  body('email').optional({ checkFalsy: true }).isEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^\d{10,14}$/)
    .withMessage('Phone must contain only digits and be between 10 and 14 digits'),
  body('experience').optional({ checkFalsy: true }).isString().isLength({ min: 10, max: 600 }),
  body('education').optional({ checkFalsy: true }).isString().isLength({ min: 10, max: 600 }),
];

module.exports = {
  validateUserCreation,
  validateUserUpdate,
};