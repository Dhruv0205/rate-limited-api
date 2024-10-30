const express = require('express');
const mongoose = require('mongoose');
const { Queue, Worker } = require('bull'); 
const UserTask = require('./models/UserTask');
const task = require('./models/Task'); 
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/rate_limiter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const taskQueue = new Queue('taskQueue');

app.use(express.json());


const rateLimit = {
  maxTasksPerSecond: 1,
  maxTasksPerMinute: 20,
};


const rateLimiter = async (req, res, next) => {
  const userId = req.body.user_id;
  if (!userId) {
    return res.status(400).send('User ID is required.');
  }

  let userTask = await UserTask.findOne({ userId });

  if (!userTask) {
    userTask = new UserTask({ userId });
  }

  const now = new Date();

  if (now - userTask.lastReset > 60 * 1000) {
    userTask.taskCount = 0;
    userTask.lastReset = now;
  }


  userTask.taskCount += 1;

  if (userTask.taskCount > rateLimit.maxTasksPerMinute) {
    return res.status(429).send('Rate limit exceeded. Your request is queued.');
  }

  await userTask.save();
  next();
};


const worker = new Worker('taskQueue', async job => {
  await task(job.data.user_id);
});


app.post('/api/v1/task', rateLimiter, (req, res) => {
  const userId = req.body.user_id;

  
  taskQueue.add({ user_id: userId });

  res.status(202).send('Your request is being processed and queued if necessary.');
});


taskQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
