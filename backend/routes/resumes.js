const express = require('express');
const { body, validationResult } = require('express-validator');
const Resume = require('../models/Resume');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// @route   GET /api/resumes
// @desc    Get all resumes for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .select('-data'); // Exclude full data for list view

    res.json(resumes);

  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Server error fetching resumes' });
  }
});

// @route   GET /api/resumes/data
// @desc    Get user's resume data (for builder)
// @access  Private
router.get('/data', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.resumeData || {});

  } catch (error) {
    console.error('Get resume data error:', error);
    res.status(500).json({ message: 'Server error fetching resume data' });
  }
});

// @route   POST /api/resumes/save-data
// @desc    Save user's resume data (for builder)
// @access  Private
router.post('/save-data', async (req, res) => {
  try {
    const resumeData = req.body;

    // Update user's resume data
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { resumeData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Resume data saved successfully',
      data: user.resumeData 
    });

  } catch (error) {
    console.error('Save resume data error:', error);
    res.status(500).json({ message: 'Server error saving resume data' });
  }
});

// @route   GET /api/resumes/:id
// @desc    Get a specific resume
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);

  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error fetching resume' });
  }
});

// @route   POST /api/resumes
// @desc    Create a new resume
// @access  Private
router.post('/', [
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, data } = req.body;

    const resume = new Resume({
      userId: req.user.userId,
      title: title || 'Untitled Resume',
      data: data || {}
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume created successfully',
      resume
    });

  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: 'Server error creating resume' });
  }
});

// @route   PUT /api/resumes/:id
// @desc    Update a resume
// @access  Private
router.put('/:id', [
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, data } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { 
        ...(title && { title }),
        ...(data && { data })
      },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({
      message: 'Resume updated successfully',
      resume
    });

  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error updating resume' });
  }
});

// @route   DELETE /api/resumes/:id
// @desc    Delete a resume
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });

  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error deleting resume' });
  }
});

module.exports = router;