import React, { useState, useEffect } from 'react';
import { Plus, FileText, Download, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { resumeAPI } from '../services/api';
import { generatePDF } from '../utils/pdfGenerator';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await resumeAPI.getResumes();
      setResumes(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      showError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewResume = async () => {
    try {
      const newResume = await resumeAPI.createResume({
        title: 'New Resume',
        data: {
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
        }
      });
      
      showSuccess('New resume created successfully!');
      // Redirect to builder with the new resume
      window.location.href = `/builder?resumeId=${newResume.resume._id}`;
    } catch (error) {
      console.error('Failed to create resume:', error);
      showError('Failed to create new resume');
    }
  };

  const handleEditResume = (resumeId) => {
    window.location.href = `/builder?resumeId=${resumeId}`;
  };

  const handleDownloadPDF = async (resume) => {
    try {
      // Create a temporary preview element
      const tempDiv = document.createElement('div');
      tempDiv.id = 'temp-resume-preview';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20mm';
      
      // Generate resume HTML content
      const resumeHTML = generateResumeHTML(resume.data);
      tempDiv.innerHTML = resumeHTML;
      
      document.body.appendChild(tempDiv);
      
      // Generate PDF
      const fileName = `${resume.data?.personalInfo?.fullName || resume.title || 'resume'}.pdf`;
      await generatePDF('temp-resume-preview', fileName);
      
      // Clean up
      document.body.removeChild(tempDiv);
      showSuccess('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      showError('Failed to generate PDF');
    }
  };

  const generateResumeHTML = (data) => {
    if (!data) return '<p>No resume data available</p>';
    
    const { personalInfo = {}, experience = [], education = [], skills = [], projects = [] } = data;
    
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <!-- Header -->
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="font-size: 28px; margin: 0; color: #1f2937;">${personalInfo.fullName || 'Your Name'}</h1>
          <div style="margin-top: 10px; font-size: 14px; color: #6b7280;">
            ${personalInfo.email ? `📧 ${personalInfo.email}` : ''}
            ${personalInfo.phone ? ` | 📞 ${personalInfo.phone}` : ''}
            ${personalInfo.location ? ` | 📍 ${personalInfo.location}` : ''}
          </div>
        </div>

        ${personalInfo.summary ? `
        <!-- Summary -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Professional Summary</h2>
          <p style="margin: 10px 0;">${personalInfo.summary}</p>
        </div>
        ` : ''}

        ${experience.length > 0 ? `
        <!-- Experience -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Professional Experience</h2>
          ${experience.map(exp => `
            <div style="margin: 15px 0; padding-left: 15px; border-left: 2px solid #3b82f6;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3 style="margin: 0; font-size: 16px; color: #1f2937;">${exp.position || ''}</h3>
                <span style="font-size: 12px; color: #6b7280;">${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</span>
              </div>
              <p style="margin: 5px 0; color: #2563eb; font-weight: 500;">${exp.company || ''}</p>
              ${exp.location ? `<p style="margin: 5px 0; font-size: 12px; color: #6b7280;">${exp.location}</p>` : ''}
              ${exp.description ? `<p style="margin: 10px 0; font-size: 14px;">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${education.length > 0 ? `
        <!-- Education -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Education</h2>
          ${education.map(edu => `
            <div style="margin: 15px 0; padding-left: 15px; border-left: 2px solid #10b981;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3 style="margin: 0; font-size: 16px; color: #1f2937;">${edu.degree || ''} in ${edu.field || ''}</h3>
                <span style="font-size: 12px; color: #6b7280;">${edu.startDate || ''} - ${edu.endDate || ''}</span>
              </div>
              <p style="margin: 5px 0; color: #2563eb; font-weight: 500;">${edu.institution || ''}</p>
              ${edu.gpa ? `<p style="margin: 5px 0; font-size: 12px; color: #6b7280;">GPA: ${edu.gpa}</p>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${skills.length > 0 ? `
        <!-- Skills -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Skills</h2>
          <div style="margin: 10px 0;">
            ${skills.map(skill => `
              <span style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px;">${skill.name || ''}</span>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${projects.length > 0 ? `
        <!-- Projects -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Projects</h2>
          ${projects.map(project => `
            <div style="margin: 15px 0; padding-left: 15px; border-left: 2px solid #8b5cf6;">
              <h3 style="margin: 0; font-size: 16px; color: #1f2937;">${project.name || ''}</h3>
              ${project.description ? `<p style="margin: 10px 0; font-size: 14px;">${project.description}</p>` : ''}
              ${project.technologies ? `<p style="margin: 5px 0; color: #2563eb; font-size: 12px;">Technologies: ${project.technologies}</p>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    `;
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeAPI.deleteResume(id);
        setResumes(resumes.filter(resume => resume._id !== id));
        showSuccess('Resume deleted successfully');
      } catch (error) {
        console.error('Failed to delete resume:', error);
        showError('Failed to delete resume');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const getResumeStatus = (resume) => {
    if (!resume.data) return 'draft';
    
    const { personalInfo, experience, education, skills, projects } = resume.data;
    let completedSections = 0;
    
    if (personalInfo?.fullName) completedSections++;
    if (experience?.length > 0) completedSections++;
    if (education?.length > 0) completedSections++;
    if (skills?.length > 0) completedSections++;
    if (projects?.length > 0) completedSections++;
    
    return completedSections >= 3 ? 'complete' : 'draft';
  };

  const getSectionCount = (resume) => {
    if (!resume.data) return 0;
    
    const { personalInfo, experience, education, skills, projects } = resume.data;
    let count = 0;
    
    if (personalInfo?.fullName) count++;
    if (experience?.length > 0) count++;
    if (education?.length > 0) count++;
    if (skills?.length > 0) count++;
    if (projects?.length > 0) count++;
    
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
          <p className="text-gray-600">Manage and organize your professional resumes</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.email || 'No email'}</p>
              <p className="text-sm text-gray-500">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Resume Card */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Resume</h3>
              <p className="text-gray-600 mb-4">Start building a new professional resume</p>
              <button
                onClick={handleCreateNewResume}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Get Started
              </button>
            </div>
          </div>

          {/* Resume Cards */}
          {resumes.map((resume) => (
            <div key={resume._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{resume.title || 'Untitled Resume'}</h3>
                      <p className="text-sm text-gray-500">
                        Updated {formatDate(resume.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Sections:</span> {getSectionCount(resume)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      getResumeStatus(resume) === 'complete' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getResumeStatus(resume) === 'complete' ? 'Complete' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditResume(resume._id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(resume)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    PDF
                  </button>
                  <button 
                    onClick={() => handleDeleteResume(resume._id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {resumes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first professional resume to get started</p>
            <button
              onClick={handleCreateNewResume}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;