import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink, Github, Edit2 } from 'lucide-react';

export const ResumePreview = ({ data, onEditHeading, editingHeading, tempHeading, onSaveHeading, onCancelEdit, setTempHeading }) => {
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
          <div className="flex items-center gap-2 mb-3">
            {editingHeading === 'summary' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempHeading}
                  onChange={(e) => setTempHeading(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSaveHeading('summary');
                    if (e.key === 'Escape') onCancelEdit();
                  }}
                  className="text-xl font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => onSaveHeading('summary')}
                  className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 p-1 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 rounded"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {data.headings?.summary || 'Professional Summary'}
                </h2>
                <button
                  onClick={() => onEditHeading('summary', data.headings?.summary || 'Professional Summary')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {editingHeading === 'experience' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempHeading}
                  onChange={(e) => setTempHeading(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSaveHeading('experience');
                    if (e.key === 'Escape') onCancelEdit();
                  }}
                  className="text-xl font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => onSaveHeading('experience')}
                  className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 p-1 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 rounded"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {data.headings?.experience || 'Professional Experience'}
                </h2>
                <button
                  onClick={() => onEditHeading('experience', data.headings?.experience || 'Professional Experience')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
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
          <div className="flex items-center gap-2 mb-4">
            {editingHeading === 'education' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempHeading}
                  onChange={(e) => setTempHeading(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSaveHeading('education');
                    if (e.key === 'Escape') onCancelEdit();
                  }}
                  className="text-xl font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => onSaveHeading('education')}
                  className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 p-1 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 rounded"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {data.headings?.education || 'Education'}
                </h2>
                <button
                  onClick={() => onEditHeading('education', data.headings?.education || 'Education')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
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
          <div className="flex items-center gap-2 mb-4">
            {editingHeading === 'skills' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempHeading}
                  onChange={(e) => setTempHeading(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSaveHeading('skills');
                    if (e.key === 'Escape') onCancelEdit();
                  }}
                  className="text-xl font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => onSaveHeading('skills')}
                  className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 p-1 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 rounded"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {data.headings?.skills || 'Skills'}
                </h2>
                <button
                  onClick={() => onEditHeading('skills', data.headings?.skills || 'Skills')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
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
          <div className="flex items-center gap-2 mb-4">
            {editingHeading === 'projects' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempHeading}
                  onChange={(e) => setTempHeading(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSaveHeading('projects');
                    if (e.key === 'Escape') onCancelEdit();
                  }}
                  className="text-xl font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => onSaveHeading('projects')}
                  className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 p-1 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 rounded"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {data.headings?.projects || 'Projects'}
                </h2>
                <button
                  onClick={() => onEditHeading('projects', data.headings?.projects || 'Projects')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
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

      {/* Custom Sections */}
      {data.customSections && data.customSections.map((section) => (
        <div key={section.id} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {editingHeading === `custom-${section.id}` ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempHeading}
                  onChange={(e) => setTempHeading(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSaveHeading(`custom-${section.id}`);
                    if (e.key === 'Escape') onCancelEdit();
                  }}
                  className="text-xl font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => onSaveHeading(`custom-${section.id}`)}
                  className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 p-1 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 rounded"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {section.title}
                </h2>
                <button
                  onClick={() => onEditHeading(`custom-${section.id}`, section.title)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>{section.content}</p>
            {section.link && (
              <a
                href={section.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2"
              >
                <ExternalLink className="w-4 h-4" />
                View More
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};