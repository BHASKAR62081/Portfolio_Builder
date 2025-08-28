import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Download, Users, Star, FolderOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { resumeAPI } from '../services/api';
import Navbar from '../components/Navbar';

// --- NEW: Improved AI Scanning Animation ---
const AiScanningAnimation = () => (
  <div className="relative w-full max-w-lg mx-auto aspect-square">
    <style>
      {`
        .scanner-line {
          animation: scan-vertical 4s ease-in-out infinite;
        }
        .particle {
          animation: burst 4s ease-in-out infinite;
        }
        .doc-line {
          animation: enhance 4s ease-in-out infinite;
        }
        @keyframes scan-vertical {
          0%, 100% { transform: translateY(-20%); opacity: 0; }
          20% { transform: translateY(0%); opacity: 1; }
          80% { transform: translateY(100%); opacity: 1; }
          95% { transform: translateY(120%); opacity: 0; }
        }
        @keyframes burst {
          0%, 40%, 100% { transform: scale(0); opacity: 0; }
          50%, 70% { transform: scale(1); opacity: 1; }
          80% { transform: scale(0.5); opacity: 0; }
        }
        @keyframes enhance {
          0%, 40%, 100% { stroke: #4B5563; } /* dark:stroke-gray-600 */
          60%, 80% { stroke: #3B82F6; } /* stroke-blue-500 */
        }
        .particle-1 { animation-delay: 0.2s; }
        .particle-2 { animation-delay: 0.5s; }
        .particle-3 { animation-delay: 0.8s; }
        .particle-4 { animation-delay: 1.1s; }
        .line-1 { animation-delay: 0.1s; }
        .line-2 { animation-delay: 0.3s; }
        .line-3 { animation-delay: 0.5s; }
        .line-4 { animation-delay: 0.7s; }
        .line-5 { animation-delay: 0.9s; }
        .line-6 { animation-delay: 1.1s; }
      `}
    </style>
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Document Outline */}
      <rect x="50" y="30" width="100" height="140" rx="6" className="fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-700" strokeWidth="2" />
      
      {/* Document Content Lines */}
      <g strokeWidth="2" className="stroke-gray-600">
        <line className="doc-line line-1" x1="65" y1="50" x2="135" y2="50" />
        <line className="doc-line line-2" x1="65" y1="60" x2="115" y2="60" />
        <line className="doc-line line-3" x1="65" y1="80" x2="135" y2="80" />
        <line className="doc-line line-4" x1="65" y1="90" x2="125" y2="90" />
        <line className="doc-line line-5" x1="65" y1="110" x2="135" y2="110" />
        <line className="doc-line line-6" x1="65" y1="120" x2="105" y2="120" />
      </g>

      {/* Scanner and Particles */}
      <g>
        <defs>
          <linearGradient id="scanner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="stop-transparent" />
            <stop offset="50%" className="stop-blue-400" />
            <stop offset="100%" className="stop-transparent" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Scanner Line */}
        {/* <rect className="scanner-line" x="50" y="30" width="100" height="140" fill="url(#scanner-gradient)" opacity="0.4" /> */}
        <rect className="scanner-line" x="45" y="30" width="110" height="3" fill="white" filter="url(#glow)" />

        {/* Enhancement Particles */}
        <g className="fill-purple-500">
          <circle className="particle particle-1" cx="80" cy="55" r="3" />
          <circle className="particle particle-2" cx="120" cy="85" r="4" />
          <circle className="particle particle-3" cx="75" cy="115" r="3" />
          <circle className="particle particle-4" cx="130" cy="125" r="2" />
        </g>
      </g>
    </svg>
  </div>
);


const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalUsers: 0,
    successRate: 95,
    userRating: 4.8
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await resumeAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalResumes: 1247,
        totalUsers: 892,
        successRate: 95,
        userRating: 4.8
      });
    }
  };

  const handleStartBuilding = () => {
    navigate(isAuthenticated ? '/builder' : '/register');
  };

  const handleMyResumes = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Unfair Advantage in the 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Job Hunt</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Don't just build a resume—build a better one. Our AI co-pilot analyzes your content and provides expert, real-time suggestions to ensure you stand out from the competition.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
              <button
                onClick={handleStartBuilding}
                className="group flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="text-lg font-semibold">Start Building</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {isAuthenticated ? (
                <button
                  onClick={handleMyResumes}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span className="text-lg font-semibold">My Resumes</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300"
                >
                  <span className="text-lg font-semibold">Sign In</span>
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <AiScanningAnimation />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Easy Builder</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Intuitive interface with real-time preview. Build your resume 
              section by section with our guided process.
            </p>
          </div>

          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">PDF Export</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Download your resume as a high-quality PDF that's ready to send to employers 
              or upload to job boards.
            </p>
          </div>

          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">ATS Friendly</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our templates are optimized for Applicant Tracking Systems, ensuring your 
              resume gets past automated screening.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalResumes.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Resumes Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.successRate}%</div>
              <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < Math.floor(stats.userRating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{stats.userRating}/5 User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of job seekers who have successfully created professional resumes 
          with our platform.
        </p>
        <button
          onClick={handleStartBuilding}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="text-lg font-semibold">
            {isAuthenticated ? 'Start Building' : 'Get Started Free'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
