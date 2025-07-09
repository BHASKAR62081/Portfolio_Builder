import jsPDF from 'jspdf';

export const generatePDF = async (elementId, filename = 'resume.pdf') => {
  try {
    // Get resume data from global variable or parse from DOM
    let resumeData;
    if (window.currentResumeData) {
      resumeData = window.currentResumeData;
    } else {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found and no resume data available');
      }
      resumeData = parseResumeFromDOM(element);
    }
    
    // Create PDF with text content
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Set up fonts and styling
    pdf.setFont('helvetica');
    
    let yPosition = 20;
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Helper function to add text with word wrapping
    const addText = (text, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
      if (!text) return yPosition;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(color[0], color[1], color[2]);
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      
      // Check if we need a new page
      if (yPosition + (lines.length * fontSize * 0.35) > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.35 + 2;
      
      return yPosition;
    };
    
    // Helper function to add a line separator
    const addLine = () => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setDrawColor(59, 130, 246); // Blue color
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    };
    
    // Header Section
    if (resumeData.personalInfo.fullName) {
      addText(resumeData.personalInfo.fullName.toString(), 20, true, [31, 41, 55]);
      yPosition += 3;
    }
    
    // Contact Information
    const contactInfo = [];
    if (resumeData.personalInfo.email) contactInfo.push(`Email: ${resumeData.personalInfo.email}`);
    if (resumeData.personalInfo.phone) contactInfo.push(`Phone: ${resumeData.personalInfo.phone}`);
    if (resumeData.personalInfo.location) contactInfo.push(`Location: ${resumeData.personalInfo.location}`);
    if (resumeData.personalInfo.linkedin) contactInfo.push(`LinkedIn: ${resumeData.personalInfo.linkedin}`);
    if (resumeData.personalInfo.website) contactInfo.push(`Website: ${resumeData.personalInfo.website}`);
    
    if (contactInfo.length > 0) {
      addText(contactInfo.join(' | '), 9, false, [107, 114, 128]);
    }
    
    addLine();
    yPosition += 5;
    
    // Professional Summary
    if (resumeData.personalInfo.summary) {
      addText('PROFESSIONAL SUMMARY', 14, true, [59, 130, 246]);
      yPosition += 2;
      addText(resumeData.personalInfo.summary.toString(), 10);
      yPosition += 5;
    }
    
    // Professional Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      addText('PROFESSIONAL EXPERIENCE', 14, true, [59, 130, 246]);
      yPosition += 2;
      
      resumeData.experience.forEach((exp, index) => {
        // Position and dates
        const dateRange = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
        addText(`${(exp.position || 'Position').toString()} | ${dateRange}`, 11, true);
        
        // Company and location
        const companyInfo = exp.location ? `${(exp.company || '').toString()} | ${exp.location.toString()}` : (exp.company || '').toString();
        addText(companyInfo, 10, false, [59, 130, 246]);
        
        // Description
        if (exp.description) {
          addText(exp.description.toString(), 10);
        }
        
        if (index < resumeData.experience.length - 1) {
          yPosition += 3;
        }
      });
      yPosition += 5;
    }
    
    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      addText('EDUCATION', 14, true, [59, 130, 246]);
      yPosition += 2;
      
      resumeData.education.forEach((edu, index) => {
        // Degree and dates
        const degree = `${(edu.degree || 'Degree').toString()} in ${(edu.field || 'Field').toString()}`;
        const dateRange = `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`;
        addText(`${degree} | ${dateRange}`, 11, true);
        
        // Institution
        addText((edu.institution || 'Institution').toString(), 10, false, [59, 130, 246]);
        
        // GPA
        if (edu.gpa) {
          addText(`GPA: ${edu.gpa.toString()}`, 9, false, [107, 114, 128]);
        }
        
        // Achievements
        if (edu.achievements) {
          addText(edu.achievements.toString(), 10);
        }
        
        if (index < resumeData.education.length - 1) {
          yPosition += 3;
        }
      });
      yPosition += 5;
    }
    
    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      addText('SKILLS', 14, true, [59, 130, 246]);
      yPosition += 2;
      
      // Group skills by category
      const skillsByCategory = resumeData.skills.reduce((acc, skill) => {
        const category = (skill.category || 'Other').toString();
        if (!acc[category]) acc[category] = [];
        acc[category].push((skill.name || '').toString());
        return acc;
      }, {});
      
      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        addText(`${category.toString()}:`, 10, true);
        addText(skills.join(' • '), 10);
        yPosition += 2;
      });
      yPosition += 3;
    }
    
    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      addText('PROJECTS', 14, true, [59, 130, 246]);
      yPosition += 2;
      
      resumeData.projects.forEach((project, index) => {
        // Project name
        addText((project.name || 'Project Name').toString(), 11, true);
        
        // Description
        if (project.description) {
          addText(project.description.toString(), 10);
        }
        
        // Technologies
        if (project.technologies) {
          addText(`Technologies: ${project.technologies.toString()}`, 9, false, [59, 130, 246]);
        }
        
        // Links
        const links = [];
        if (project.link) links.push('Live Demo: ' + project.link.toString());
        if (project.github) links.push('GitHub: ' + project.github.toString());
        if (links.length > 0) {
          addText(links.join(' | '), 9, false, [107, 114, 128]);
        }
        
        if (index < resumeData.projects.length - 1) {
          yPosition += 3;
        }
      });
    }
    
    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper function to parse resume data from DOM
const parseResumeFromDOM = (element) => {
  // Fallback: parse from DOM structure
  const resumeData = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  };
  
  if (!element) return resumeData;
  
  // Parse name from h1
  const nameElement = element.querySelector('h1');
  if (nameElement) {
    resumeData.personalInfo.fullName = nameElement.textContent.trim();
  }
  
  // Parse contact info
  const contactElements = element.querySelectorAll('[class*="gap-1"]');
  contactElements.forEach(el => {
    const text = el.textContent.trim();
    if (text.includes('@')) resumeData.personalInfo.email = text.replace(/[^\w@.-]/g, '');
    if (text.includes('(') || text.includes('+')) resumeData.personalInfo.phone = text.replace(/[^\d\s\(\)\-\+]/g, '');
    if (text.includes(',') && !text.includes('@')) resumeData.personalInfo.location = text;
  });
  
  // Parse summary
  const summarySection = element.querySelector('h2');
  if (summarySection && summarySection.textContent.includes('Summary')) {
    const summaryP = summarySection.nextElementSibling;
    if (summaryP) {
      resumeData.personalInfo.summary = summaryP.textContent.trim();
    }
  }
  
  return resumeData;
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString.toString());
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};