import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const CustomSectionForm = ({ data = [], onChange }) => {
  const addCustomSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
      link: ''
    };
    onChange([...data, newSection]);
  };

  const removeCustomSection = (id) => {
    onChange(data.filter(section => section.id !== id));
  };

  const updateCustomSection = (id, field, value) => {
    onChange(data.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  return (
    <div className="space-y-4 mt-4">
      <button
        onClick={addCustomSection}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Custom Section
      </button>

      {data.map((section) => (
        <div key={section.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-start mb-4">
            {/* --- FIX: Display the dynamic section title --- */}
            <h4 className="text-md font-medium text-gray-800 dark:text-white">
              {section.title || 'Custom Section'}
            </h4>
            <button
              onClick={() => removeCustomSection(section.id)}
              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Title *
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Certifications, Awards, Publications"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                value={section.content}
                onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the content for this section..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link (Optional)
              </label>
              <input
                type="url"
                value={section.link}
                onChange={(e) => updateCustomSection(section.id, 'link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com (optional)"
              />
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="mb-2">No custom sections added yet</p>
          <p className="text-sm">Add sections like Certifications, Awards, Publications, etc.</p>
        </div>
      )}
    </div>
  );
};
