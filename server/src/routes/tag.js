const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticate } = require('../middleware/auth');

// All tag routes require authentication
router.use(authenticate);

// GET /api/tags - List all tags
router.get('/', async (req, res) => {
  try {
    const tags = await db.Tag.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching tags.'
    });
  }
});

// GET /api/tags/:id - Get a specific tag
router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;

    const tag = await db.Tag.findOne({
      where: { id: tagId }
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Get tag error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the tag.'
    });
  }
});

// POST /api/tags - Create a new tag
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tag name is required'
      });
    }

    // Check if tag already exists
    const existingTag = await db.Tag.findOne({
      where: { name: name.trim() }
    });

    if (existingTag) {
      return res.status(200).json({
        success: true,
        message: 'Tag already exists',
        data: existingTag
      });
    }

    // Create tag
    const tag = await db.Tag.create({
      name: name.trim()
    });

    res.status(200).json({
      success: true,
      message: 'Tag created successfully',
      data: tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the tag.'
    });
  }
});

// PATCH /api/tags/:id - Update a tag
router.patch('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const { name } = req.body;

    const tag = await db.Tag.findOne({
      where: { id: tagId }
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    await tag.update({
      name: name !== undefined ? name : tag.name
    });

    res.status(200).json({
      success: true,
      message: 'Tag updated successfully',
      data: tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the tag.'
    });
  }
});

// DELETE /api/tags/:id - Delete a tag
router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;

    const tag = await db.Tag.findOne({
      where: { id: tagId }
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    await tag.destroy();

    res.status(200).json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the tag.'
    });
  }
});

module.exports = router;
