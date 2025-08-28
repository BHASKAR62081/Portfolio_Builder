import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

// --- FIX: Add a default value to the data prop ---
// If `data` is undefined, it will default to an empty array `[]`.
export const ProjectsSection = ({ data = [], onChange }) => {
  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      github: ''
    };
    // If data was undefined, it's now a new array with one item.
    onChange([...data, newProject]);
  };

  const removeProject = (id) => {
    onChange(data.filter(item => item.id !== id));
  };

  const updateProject = (id, field, value) => {
    onChange(data.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-4 mt-4">
      <button
        onClick={addProject}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Project
      </button>

      {/* This .map() call is now safe because `data` will always be an array. */}
      {data.map((project) => (
        <div key={project.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-md font-medium text-gray-800">Project Entry</h4>
            <button
              onClick={() => removeProject(project.id)}
              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Project Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the project and your role..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, TypeScript, Node.js"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://project-demo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  value={project.github}
                  onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
