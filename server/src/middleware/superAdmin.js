/**
 * Super Admin middleware
 * Must be used AFTER the authenticate middleware
 * Checks that the authenticated user has 'super_admin' role
 */
const superAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Super admin privileges required.'
            });
        }

        next();
    } catch (error) {
        console.error('Super admin middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

module.exports = { superAdmin };
