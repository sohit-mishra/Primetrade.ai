const express = require('express');
const router = express.Router();
const userRoutes = require('@/Routers/userRoutes');
const taskRoutes = require('@/Routers/taskRoutes');

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes); 

module.exports = router;
