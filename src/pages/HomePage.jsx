import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Download, Users, Star, FolderOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { resumeAPI } from '../services/api';
import Navbar from '../components/Navbar';

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
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Build Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Resume</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create professional, ATS-friendly resumes in minutes. Our intuitive builder helps you craft 
            compelling resumes that get you noticed by employers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Easy Builder</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Intuitive drag-and-drop interface with real-time preview. Build your resume 
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

        {/* Stats Section */}
        <div className="mt-24 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
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

        {/* CTA Section */}
        <div className="mt-24 text-center">
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
    </div>
  );
};

export default HomePage;
