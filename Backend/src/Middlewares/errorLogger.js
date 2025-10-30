const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const errorLogger = (err, req, res, next) => {
  const errorLog = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.message}\n`;

  console.error(errorLog);

  fs.appendFile(path.join(logDir, 'error.log'), errorLog, (fsErr) => {
    if (fsErr) console.error('Failed to write to error log:', fsErr);
  });

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
};

module.exports = errorLogger;
