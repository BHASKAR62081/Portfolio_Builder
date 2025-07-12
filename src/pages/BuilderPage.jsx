import React, { useState, useEffect } from 'react';
import { Download, Save, Cloud, CloudOff, ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { PersonalInfoSection } from '../components/PersonalInfoSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { EducationSection } from '../components/EducationSection';
import { SkillsSection } from '../components/SkillsSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ResumePreview } from '../components/ResumePreview';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generatePDF } from '../utils/pdfGenerator';
import { useToast } from '../contexts/ToastContext';
import { resumeAPI } from '../services/api';
import Navbar from '../components/Navbar';

const initialData = {
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

const BuilderPage = () => {
  const [resumeData, setResumeData] = useLocalStorage('resumeData', initialData);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState(null);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const { showSuccess, showError } = useToast();

  // Get resume ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('resumeId');
    if (resumeId) {
      setCurrentResumeId(resumeId);
      loadSpecificResume(resumeId);
    } else {
      // For new resumes, start with fresh data
      setResumeData(initialData);
      setResumeTitle('New Resume');
    }
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Make resume data available globally for PDF generation
  useEffect(() => {
    window.currentResumeData = resumeData;
    return () => {
      delete window.currentResumeData;
    };
  }, [resumeData]);

  // Load specific resume by ID
  const loadSpecificResume = async (resumeId) => {
    if (isOnline) {
      try {
        const resume = await resumeAPI.getResume(resumeId);
        if (resume && resume.data) {
          setResumeData(resume.data);
          setResumeTitle(resume.title || 'Untitled Resume');
          setLastSaved(new Date(resume.updatedAt));
        }
      } catch (error) {
        console.error('Failed to load specific resume:', error);
        showError('Failed to load resume');
      }
    }
  };

  // Auto-save to cloud every 30 seconds if online
  useEffect(() => {
    if (!isOnline) return;

    const autoSave = setInterval(async () => {
      try {
        if (currentResumeId) {
          await resumeAPI.updateResume(currentResumeId, {
            title: resumeTitle,
            data: resumeData
          });
        } else {
          // For new resumes without ID, save to general resume data
          await resumeAPI.saveResumeData(resumeData);
        }
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSave);
  }, [resumeData, resumeTitle, currentResumeId, isOnline]);

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const fileName = `${resumeData.personalInfo.fullName || resumeTitle}.pdf`;
      await generatePDF('resume-preview', fileName);
      showSuccess('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      showError('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isOnline) {
        if (currentResumeId) {
          // Update existing resume
          await resumeAPI.updateResume(currentResumeId, {
            title: resumeTitle,
            data: resumeData
          });
        } else {
          // Create new resume
          const newResume = await resumeAPI.createResume({
            title: resumeTitle,
            data: resumeData
          });
          setCurrentResumeId(newResume.resume._id);
          // Update URL to include the new resume ID
          window.history.replaceState({}, '', `/builder?resumeId=${newResume.resume._id}`);
        }
        setLastSaved(new Date());
        showSuccess('Resume saved successfully!');
      } else {
        showSuccess('Resume saved locally! Will sync when online.');
      }
    } catch (error) {
      console.error('Save failed:', error);
      showError('Failed to save to cloud. Data saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToProfile = () => {
    try {
      // Save current work before navigating
      if (resumeData && Object.keys(resumeData).length > 0) {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
      }
      window.location.href = '/profile';
    } catch (error) {
      console.error('Navigation error:', error);
      showError('Failed to navigate back to profile');
    }
  };

  const handleEditTitle = () => {
    setTempTitle(resumeTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setResumeTitle(tempTitle.trim());
      setIsEditingTitle(false);
    }
  };

  const handleCancelEdit = () => {
    setTempTitle('');
    setIsEditingTitle(false);
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never';
    return lastSaved.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToProfile}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </button>
            <div>
              <div className="flex items-center gap-3">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={handleTitleKeyPress}
                      className="text-2xl font-bold text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Resume Title"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{resumeTitle}</h1>
                    <button
                      onClick={handleEditTitle}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {isOnline ? (
                  <Cloud className="w-4 h-4 text-green-600" />
                ) : (
                  <CloudOff className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isOnline ? 'Online' : 'Offline'} • Last saved: {formatLastSaved()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {!isOnline && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              You're currently offline. Changes are being saved locally and will sync when you're back online.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Personal Information */}
              <SectionHeader
                title="Personal Information"
                isCollapsed={collapsedSections.personal}
                onToggle={() => toggleSection('personal')}
              >
                <PersonalInfoSection
                  data={resumeData.personalInfo}
                  onChange={(data) => setResumeData(prev => ({ ...prev, personalInfo: data }))}
                />
              </SectionHeader>

              {/* Experience */}
              <SectionHeader
                title="Work Experience"
                isCollapsed={collapsedSections.experience}
                onToggle={() => toggleSection('experience')}
              >
                <ExperienceSection
                  data={resumeData.experience}
                  onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))}
                />
              </SectionHeader>

              {/* Education */}
              <SectionHeader
                title="Education"
                isCollapsed={collapsedSections.education}
                onToggle={() => toggleSection('education')}
              >
                <EducationSection
                  data={resumeData.education}
                  onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))}
                />
              </SectionHeader>

              {/* Skills */}
              <SectionHeader
                title="Skills"
                isCollapsed={collapsedSections.skills}
                onToggle={() => toggleSection('skills')}
              >
                <SkillsSection
                  data={resumeData.skills}
                  onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))}
                />
              </SectionHeader>

              {/* Projects */}
              <SectionHeader
                title="Projects"
                isCollapsed={collapsedSections.projects}
                onToggle={() => toggleSection('projects')}
              >
                <ProjectsSection
                  data={resumeData.projects}
                  onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))}
                />
              </SectionHeader>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Live Preview</h3>
              </div>
              <div className="max-h-screen overflow-y-auto">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;