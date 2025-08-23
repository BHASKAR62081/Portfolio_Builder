import React from 'react';

const AnimatedGraphic = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-96 overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-8 w-24 h-24 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main resume illustration */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="relative">
          {/* Resume document */}
          <div className="w-48 h-64 bg-white dark:bg-gray-800 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-200 dark:border-gray-700">
            {/* Document header */}
            <div className="p-4">
              <div className="h-3 bg-gray-800 dark:bg-white rounded mb-2 animate-pulse"></div>
              <div className="h-2 bg-gray-400 dark:bg-gray-400 rounded mb-1 w-3/4"></div>
              <div className="h-2 bg-gray-400 dark:bg-gray-400 rounded mb-4 w-1/2"></div>
              
              {/* Content lines */}
              <div className="space-y-2">
                <div className="h-2 bg-blue-300 dark:bg-blue-600 rounded w-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-5/6"></div>
                <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-4/6"></div>
                
                <div className="pt-2">
                  <div className="h-2 bg-purple-300 dark:bg-purple-600 rounded w-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <div className="h-2 bg-purple-200 dark:bg-purple-700 rounded w-3/4 mt-1"></div>
                  <div className="h-2 bg-purple-200 dark:bg-purple-700 rounded w-2/3 mt-1"></div>
                </div>
                
                <div className="pt-2">
                  <div className="h-2 bg-green-300 dark:bg-green-600 rounded w-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  <div className="h-2 bg-green-200 dark:bg-green-700 rounded w-4/5 mt-1"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center h-full text-white text-xs font-bold">✓</div>
          </div>
          
          <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-green-500 rounded-full animate-pulse opacity-80">
            <div className="flex items-center justify-center h-full text-white text-xs">★</div>
          </div>

          {/* Sparkle effects */}
          <div className="absolute top-8 left-12 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute bottom-16 right-8 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-20 right-4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping opacity-70" style={{ animationDelay: '1.2s' }}></div>
        </div>

        {/* Side elements */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col space-y-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg animate-float opacity-80">
              <div className="flex items-center justify-center h-full text-white text-lg">📄</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg animate-float opacity-70" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-center h-full text-white text-sm">✏️</div>
            </div>
          </div>
        </div>

        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col space-y-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg animate-float opacity-80" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-center h-full text-white text-sm">💼</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg animate-float opacity-70" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center justify-center h-full text-white text-lg">🎯</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated lines connecting elements */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 50 100 Q 150 50 250 100 T 450 100"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
          strokeDasharray="5,5"
        />
        <path
          d="M 100 200 Q 200 150 300 200 T 500 200"
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          fill="none"
          className="animate-pulse"
          strokeDasharray="3,3"
          style={{ animationDelay: '0.5s' }}
        />
      </svg>
    </div>
  );
};

export default AnimatedGraphic;