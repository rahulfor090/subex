// models/transaction_model.js

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transaction", {

        transaction_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        subscription_id: {
            type: DataTypes.BIGINT,
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

        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
            allowNull: false,
            defaultValue: 'pending'
        },

        payment_method: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        gateway_reference: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'External payment gateway transaction ID'
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }

    }, {
        tableName: "transactions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });

    return Transaction;
};
