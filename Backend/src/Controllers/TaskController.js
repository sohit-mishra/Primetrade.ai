const Task = require("@/Models/Task");
const redisClient = require("@/Config/redisClient");

const cacheKeys = {
  allTasks: (userId, search, status, page, limit) =>
    `tasks:user:${userId}:search:${search || "all"}:status:${status || "all"}:page:${page}:limit:${limit}`,
  singleTask: (id) => `task:${id}`,
};

const invalidateUserTasksCache = async (userId) => {
  const stream = redisClient.scanIterator({
    MATCH: `tasks:user:${userId}:*`,
  });
  for await (const key of stream) {
    await redisClient.del(key);
  }
};

const GetAllTasksByOwner = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { search = "", status = "all", page = 1, limit = 5 } = req.query;

    const query = { user: userId };
    if (search) query.title = { $regex: search, $options: "i" };
    if (status !== "all") query.status = status;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const cacheKey = cacheKeys.allTasks(userId, search, status, pageNumber, limitNumber);
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        fromCache: true,
        ...JSON.parse(cachedData),
      });
    }

    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    const result = {
      fromCache: false,
      tasks,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    };

    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetSingleTask = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const cacheKey = cacheKeys.singleTask(id);

    const cachedTask = await redisClient.get(cacheKey);
    if (cachedTask) {
      const task = JSON.parse(cachedTask);
      if (task.user.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to view this task" });
      }
      return res.status(200).json({ fromCache: true, task });
    }

    const task = await Task.findById(id).lean();
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== userId)
      return res.status(403).json({ message: "You are not authorized to view this task" });

    await redisClient.set(cacheKey, JSON.stringify(task), { EX: 3600 });
    return res.status(200).json({ fromCache: false, task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const CreateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newTask = new Task({
      title,
      description,
      user: userId,
      status: "pending",
    });

    await newTask.save();
    await invalidateUserTasksCache(userId);

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const { title, description, status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== userId)
      return res.status(403).json({ message: "You are not authorized to update this task" });

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;

    await task.save();
    await redisClient.del(cacheKeys.singleTask(id));
    await invalidateUserTasksCache(userId);

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const { status } = req.body;

    const allowedStatuses = ["pending", "in-progress", "completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== userId)
      return res.status(403).json({ message: "You are not authorized to update this task" });

    task.status = status;
    await task.save();

    await redisClient.del(cacheKeys.singleTask(id));
    await invalidateUserTasksCache(userId);

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== userId)
      return res.status(403).json({ message: "You are not authorized to delete this task" });

    await Task.deleteOne({ _id: id });
    await redisClient.del(cacheKeys.singleTask(id));
    await invalidateUserTasksCache(userId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  CreateTask,
  UpdateTask,
  DeleteTask,
  UpdateStatus,
  GetSingleTask,
  GetAllTasksByOwner,
};
