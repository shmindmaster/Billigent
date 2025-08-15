import winston from "winston";

// Create a structured logger with proper levels and formatting
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "billigent-backend" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Add file transport in production
if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    })
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
    })
  );
}

// Export structured logging methods
export const log = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    logger.info(msg, meta);
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    logger.warn(msg, meta);
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    logger.error(msg, meta);
  },
  debug: (msg: string, meta?: Record<string, unknown>) => {
    logger.debug(msg, meta);
  },
};

export default logger;
