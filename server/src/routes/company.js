const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticate } = require('../middleware/auth');

// All company routes require authentication
router.use(authenticate);

// GET /api/companies - List all companies
router.get('/', async (req, res) => {
  try {
    const companies = await db.Company.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Get companies error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching companies.'
    });
  }
});

// GET /api/companies/:id - Get a specific company
router.get('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await db.Company.findOne({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the company.'
    });
  }
});

// POST /api/companies - Create a new company
router.post('/', async (req, res) => {
  try {
    const { name, image } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    // Check if company already exists
    const existingCompany = await db.Company.findOne({
      where: { name: name.trim() }
    });

    if (existingCompany) {
      return res.status(200).json({
        success: true,
        message: 'Company already exists',
        data: existingCompany
      });
    }

    // Create company
    const company = await db.Company.create({
      name: name.trim(),
      image: image || null,
      is_active: true
    });

    res.status(200).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    console.error('Create company error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the company.'
    });
  }
});

// PATCH /api/companies/:id - Update a company
router.patch('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    const { name, image, is_active } = req.body;

    const company = await db.Company.findOne({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await company.update({
      name: name !== undefined ? name : company.name,
      image: image !== undefined ? image : company.image,
      is_active: is_active !== undefined ? is_active : company.is_active
    });

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Update company error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the company.'
    });
  }
});

// DELETE /api/companies/:id - Delete a company
router.delete('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await db.Company.findOne({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Soft delete by setting is_active to false
    await company.update({ is_active: false });

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the company.'
    });
  }
});

module.exports = router;
