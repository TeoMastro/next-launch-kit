import winston from 'winston';
import 'winston-daily-rotate-file';

const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'nextjs-app' },
  transports: [
    new transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM',
      zippedArchive: true,
    }),

    new transports.DailyRotateFile({
      level: 'info',
      filename: 'logs/info-%DATE%.log',
      datePattern: 'YYYY-MM',
      zippedArchive: true,
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format((info) => {
          return info.level === 'info' ? info : false;
        })()
      ),
    }),

    new transports.DailyRotateFile({
      level: 'info',
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM',
      zippedArchive: true,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
