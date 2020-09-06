const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;
 
const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
  let msg = `${timestamp} [${level}] : ${message} `  
  if(metadata) {
	msg += JSON.stringify(metadata)
  }
  return msg
});

const logger = createLogger({
  level: 'debug',
  format:  combine( splat(), timestamp(), myFormat ),
  transports: [
	new transports.File({ filename: 'backend.log'}),
  ]
});
 
// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine( format.colorize(), splat(), timestamp(), myFormat )
  }));
}

module.exports = logger;