// utils/logger.js — Winston audit & application logger
const { createLogger, format, transports } = require('winston');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { service: 'subex-admin' },
    transports: [
        // Audit log — admin actions (role changes, deletes, restores)
        new transports.File({
            filename: path.join(logsDir, 'audit.log'),
            level: 'warn',
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 5,
        }),
        // Error log
        new transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
        }),
        // Combined log
        new transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 3,
        }),
    ],
});

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp, ...meta }) => {
                const metaStr = Object.keys(meta).length > 1
                    ? ` ${JSON.stringify(meta)}`
                    : '';
                return `${timestamp} [${level}]: ${message}${metaStr}`;
            })
        ),
    }));
}

// Helper for audit logging
logger.audit = (action, adminId, details = {}) => {
    logger.warn(`AUDIT: ${action}`, {
        type: 'audit',
        adminId,
        action,
        ...details,
        timestamp: new Date().toISOString(),
    });
};

module.exports = logger;
