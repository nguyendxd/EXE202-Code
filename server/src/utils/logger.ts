import { createLogger, format, transports } from "winston";
import path from "path";

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(__dirname, "../../logs/exceptions.log"),
    }),
  ],
});

export default logger;
