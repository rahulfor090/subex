// middleware/rbac.js — Role-Based Access Control
// Generic authorize middleware that accepts allowed roles as arguments
// Usage: authorize('super_admin') or authorize('admin', 'super_admin')

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions.'
            });
        }

        next();
    };
};

module.exports = { authorize };
