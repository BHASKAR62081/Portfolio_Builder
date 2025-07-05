const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Resume',
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  data: {
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
      summary: { type: String, default: '' }
    },
    experience: [{
      id: String,
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      current: { type: Boolean, default: false },
      location: String,
      description: String
    }],
    education: [{
      id: String,
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      gpa: String,
      achievements: String
    }],
    skills: [{
      id: String,
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
      },
      category: String
    }],
    projects: [{
      id: String,
      name: String,
      description: String,
      technologies: String,
      link: String,
      github: String
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'complete'],
    default: 'draft'
  },
  sections: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update sections count before saving
resumeSchema.pre('save', function(next) {
  let sectionCount = 0;
  
  if (this.data.personalInfo.fullName) sectionCount++;
  if (this.data.experience.length > 0) sectionCount++;
  if (this.data.education.length > 0) sectionCount++;
  if (this.data.skills.length > 0) sectionCount++;
  if (this.data.projects.length > 0) sectionCount++;
  
  this.sections = sectionCount;
  this.status = sectionCount >= 3 ? 'complete' : 'draft';
  
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);