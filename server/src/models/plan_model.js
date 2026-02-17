// models/plan.model.js

module.exports = (sequelize, DataTypes) => {
    const Plan = sequelize.define("Plan", {

        plan_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        interval: {
            type: DataTypes.ENUM('monthly', 'yearly'),
            allowNull: false
        },

        features: {
            type: DataTypes.TEXT, // stored as JSON string
            allowNull: true,
            get() {
                const raw = this.getDataValue('features');
                try {
                    return raw ? JSON.parse(raw) : [];
                } catch {
                    return [];
                }
            },
            set(value) {
                this.setDataValue('features', JSON.stringify(value));
            }
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        max_users: {
            type: DataTypes.INTEGER,
            allowNull: true // null = unlimited
        }

    }, {
        tableName: "plans",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });

    Plan.associate = function (models) {
        Plan.hasMany(models.Subscription, { foreignKey: 'plan_id', as: 'subscriptions' });
    };

    return Plan;
};
