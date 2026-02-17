// models/transaction.model.js

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
            defaultValue: 'INR'
        },

        status: {
            type: DataTypes.ENUM('success', 'failed', 'pending', 'refunded'),
            allowNull: false,
            defaultValue: 'pending'
        },

        payment_method: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }

    }, {
        tableName: "transactions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });

    Transaction.associate = function (models) {
        Transaction.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Transaction.belongsTo(models.Subscription, { foreignKey: 'subscription_id', as: 'subscription' });
    };

    return Transaction;
};
