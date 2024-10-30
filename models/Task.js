const fs = require('fs');
const path = require('path');

async function task(user_id) {
  const logEntry = `${user_id}-task completed at-${Date.now()}\n`;
  const logFilePath = path.join(__dirname, '../logs', 'task_log.txt');

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

module.exports = task;
