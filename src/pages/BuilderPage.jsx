import React, { useState, useEffect } from 'react';
import { Download, Save, Cloud, CloudOff } from 'lucide-react';
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
  const { showSuccess, showError } = useToast();

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

  // Load resume data from MongoDB on component mount
  useEffect(() => {
    const loadResumeData = async () => {
      if (isOnline) {
        try {
          const cloudData = await resumeAPI.getResumeData();
          if (cloudData && Object.keys(cloudData).length > 0) {
            setResumeData(cloudData);
            setLastSaved(new Date());
          }
        } catch (error) {
          console.error('Failed to load resume data from cloud:', error);
          // Continue with local data if cloud load fails
        }
      }
    };

    loadResumeData();
  }, [isOnline]);

  // Auto-save to cloud every 30 seconds if online
  useEffect(() => {
    if (!isOnline) return;

    const autoSave = setInterval(async () => {
      try {
        await resumeAPI.saveResumeData(resumeData);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSave);
  }, [resumeData, isOnline]);

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDF('resume-preview', `${resumeData.personalInfo.fullName || 'resume'}.pdf`);
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
        await resumeAPI.saveResumeData(resumeData);
        setLastSaved(new Date());
        showSuccess('Resume saved to cloud successfully!');
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

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never';
    return lastSaved.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
            <div className="flex items-center gap-2 mt-1">
              {isOnline ? (
                <Cloud className="w-4 h-4 text-green-600" />
              ) : (
                <CloudOff className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm text-gray-600">
                {isOnline ? 'Online' : 'Offline'} • Last saved: {formatLastSaved()}
              </span>
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
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              You're currently offline. Changes are being saved locally and will sync when you're back online.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b">
                <h3 className="text-lg font-medium text-gray-800">Live Preview</h3>
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