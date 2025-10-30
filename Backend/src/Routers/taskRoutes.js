const express = require('express');
const router = express.Router();
const { CreateTask,
    UpdateTask,
    DeleteTask,
    UpdateStatus,
    GetSingleTask,
    GetAllTasksByOwner } = require('@/Controllers/TaskController');

const authMiddleware = require('@/Middlewares/authMiddleware');

router.get('/all', authMiddleware, GetAllTasksByOwner);
router.post('/post', authMiddleware, CreateTask);
router.get('/:id', authMiddleware, GetSingleTask);
router.put('/updateStatus/:id', authMiddleware, UpdateStatus);
router.put('/update/:id', authMiddleware, UpdateTask);
router.delete('/delete/:id', authMiddleware, DeleteTask);

module.exports = router;



