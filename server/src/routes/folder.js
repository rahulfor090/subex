const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticate } = require('../middleware/auth');

// All folder routes require authentication
router.use(authenticate);

// GET /api/folders - List all folders
router.get('/', async (req, res) => {
  try {
    const folders = await db.Folder.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: folders
    });
  } catch (error) {
    console.error('Get folders error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching folders.'
    });
  }
});

// GET /api/folders/:id - Get a specific folder
router.get('/:id', async (req, res) => {
  try {
    const folderId = req.params.id;

    const folder = await db.Folder.findOne({
      where: { id: folderId }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    res.status(200).json({
      success: true,
      data: folder
    });
  } catch (error) {
    console.error('Get folder error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the folder.'
    });
  }
});

// POST /api/folders - Create a new folder
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required'
      });
    }

    // Check if folder already exists
    const existingFolder = await db.Folder.findOne({
      where: { name: name.trim() }
    });

    if (existingFolder) {
      return res.status(200).json({
        success: true,
        message: 'Folder already exists',
        data: existingFolder
      });
    }

    // Create folder
    const folder = await db.Folder.create({
      name: name.trim()
    });

    res.status(200).json({
      success: true,
      message: 'Folder created successfully',
      data: folder
    });
  } catch (error) {
    console.error('Create folder error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the folder.'
    });
  }
});

// PATCH /api/folders/:id - Update a folder
router.patch('/:id', async (req, res) => {
  try {
    const folderId = req.params.id;
    const { name } = req.body;

    const folder = await db.Folder.findOne({
      where: { id: folderId }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    await folder.update({
      name: name !== undefined ? name : folder.name
    });

    res.status(200).json({
      success: true,
      message: 'Folder updated successfully',
      data: folder
    });
  } catch (error) {
    console.error('Update folder error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the folder.'
    });
  }
});

// DELETE /api/folders/:id - Delete a folder
router.delete('/:id', async (req, res) => {
  try {
    const folderId = req.params.id;

    const folder = await db.Folder.findOne({
      where: { id: folderId }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    await folder.destroy();

    res.status(200).json({
      success: true,
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the folder.'
    });
  }
});

module.exports = router;
