// models/revenue_model.js

module.exports = (sequelize, DataTypes) => {
    const Revenue = sequelize.define('Revenue', {

        revenue_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        // 'salary' | 'rent' | 'referral' | 'online'
        source_category: {
            type: DataTypes.ENUM('salary', 'rent', 'referral', 'online'),
            allowNull: false
        },

        // Free-text subcategory (most useful for Rent: "Home", "Car", etc.)
        source_subcategory: {
            type: DataTypes.STRING(200),
            allowNull: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },

        currency: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'USD'
        },

        cycle: {
            type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
            allowNull: false,
            defaultValue: 'monthly'
        },

        recurring: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }, {
        tableName: 'revenue',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Revenue;
};
