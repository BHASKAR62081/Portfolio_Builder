import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SectionHeader = ({ title, isCollapsed, onToggle, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>
      {!isCollapsed && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};