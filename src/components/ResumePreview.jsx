import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink, Github } from 'lucide-react';

export const ResumePreview = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const skillsByCategory = data.skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div id="resume-preview" className="bg-white dark:bg-gray-800 p-8 shadow-lg min-h-full">
      {/* Header */}
      <div className="border-b-2 border-blue-600 dark:border-blue-400 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>Portfolio</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Professional Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">{exp.position}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                  {exp.location && <span className="text-sm text-gray-600 dark:text-gray-400">{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-green-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">{edu.degree} in {edu.field}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">{edu.institution}</p>
                {edu.gpa && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">GPA: {edu.gpa}</p>
                )}
                {edu.achievements && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{edu.achievements}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Skills</h2>
          <div className="space-y-3">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className={`px-3 py-1 text-sm rounded-full ${
                        skill.level === 'expert'
                          ? 'bg-green-100 text-green-800'
                          : skill.level === 'advanced'
                          ? 'bg-blue-100 text-blue-800'
                          : skill.level === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="border-l-2 border-purple-200 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">{project.name}</h3>
                  <div className="flex gap-2">
                    {project.link && (
                      <ExternalLink className="w-4 h-4 text-blue-600 cursor-pointer" />
                    )}
                    {project.github && (
                      <Github className="w-4 h-4 text-gray-600 cursor-pointer" />
                    )}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{project.description}</p>
                {project.technologies && (
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Technologies: {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};