const express = require('express');
const auth = require('../middleware/auth');
const TaskController = require('../controllers/taskController');

const router = express.Router();

router.get('/', auth, TaskController.getAllTasks);
router.get('/:id', auth, TaskController.getTaskById);
router.post('/', auth, TaskController.createTask);
router.put('/:id', auth, TaskController.updateTask);
router.delete('/:id', auth, TaskController.deleteTask);

module.exports = router;
