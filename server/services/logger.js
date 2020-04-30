const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
require('winston-daily-rotate-file');
const fs = require('fs');

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

var transport = new (transports.DailyRotateFile)({
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  frequency: '24h',
  maxSize: '20m',
  maxFiles: '60d'
});

const readLastLog = function() {
  let now = new Date()
  let day = now.getDate()
  let month = now.getMonth() + 1
  let filename = now.getFullYear() + "-" + (month <= 9 ? ("0" + month) : month) + "-" + (day <= 9 ? ("0" + day) : day)
  return new Promise((resolve, reject) => {
    fs.readFile(`./logs/${filename}.log`, async function(err, data) {
      if (err) {
        reject(err);
      }
      let lastLines = [];
      let lines = data ? data.toString().split(/\r?\n/) : null;
      let re = new RegExp("(?<=\: ).*");
  
      lastLines = lines.slice(-15)
      lastLines.forEach((line, index) => {
        lastLines[index] = re.exec(line) ? re.exec(line)[0] : null
      })
      lastLines = lastLines.join("\n")
  
      resolve(lastLines)
    });
  })
  
}

const logger = createLogger({
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    transport
  ]
})


module.exports = {
  logger,
  readLastLog
}

