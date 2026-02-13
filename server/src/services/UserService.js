'use strict';

const db = require('../models');

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    try {
      const user = await db.User.create(userData);
      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async getUserById(id) {
    try {
      const user = await db.User.findByPk(id, {
        include: [{
          model: db.Article,
          as: 'articles'
        }]
      });
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  async getUserByEmail(email) {
    try {
      const user = await db.User.findOne({
        where: { email }
      });
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  /**
   * Get all users
   * @param {Object} options - Query options (limit, offset, etc.)
   * @returns {Promise<Array>} Array of users
   */
  async getAllUsers(options = {}) {
    try {
      const { limit = 10, offset = 0 } = options;
      const users = await db.User.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      return users;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, updateData) {
    try {
      const user = await db.User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      await user.update(updateData);
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(id) {
    try {
      const result = await db.User.destroy({
        where: { id }
      });
      return result > 0;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  /**
   * Search users by username or email
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching users
   */
  async searchUsers(query) {
    try {
      const { Op } = require('sequelize');
      const users = await db.User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } }
          ]
        },
        limit: 20
      });
      return users;
    } catch (error) {
      throw new Error(`Error searching users: ${error.message}`);
    }
  }
}

module.exports = new UserService();
