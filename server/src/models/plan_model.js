// models/plan_model.js

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
            type: DataTypes.ENUM('monthly', 'yearly', 'weekly', 'lifetime'),
            allowNull: false,
            defaultValue: 'monthly'
        },

        features: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON string of features',
            get() {
                const raw = this.getDataValue('features');
                return raw ? JSON.parse(raw) : [];
            },
            set(value) {
                this.setDataValue('features', JSON.stringify(value));
            }
        },

        max_users: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Max users allowed on this plan'
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }, {
        tableName: "plans",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });

    return Plan;
};
