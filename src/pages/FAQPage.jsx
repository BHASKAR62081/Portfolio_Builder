import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: "How do I create a resume?",
      answer: "Simply sign up for an account, click 'Start Building' and follow our step-by-step resume builder. You can add sections for personal information, work experience, education, skills, and projects."
    },
    {
      question: "Can I download my resume as a PDF?",
      answer: "Yes! Once you've completed your resume, you can download it as a high-quality PDF that's ready to send to employers or upload to job boards."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your personal information. Your data is stored securely and we never share it with third parties."
    },
    {
      question: "Can I edit my resume after creating it?",
      answer: "Yes, you can edit your resume anytime. All changes are automatically saved, and you can access your resumes from your profile page."
    },
    {
      question: "How many resumes can I create?",
      answer: "You can create unlimited resumes with your account. This allows you to tailor different versions for different job applications."
    },
    {
      question: "Are the resume templates ATS-friendly?",
      answer: "Yes, all our templates are designed to be ATS (Applicant Tracking System) friendly, ensuring your resume gets past automated screening systems."
    },
    {
      question: "Do I need to verify my email?",
      answer: "Yes, email verification is required to ensure account security and to enable password recovery features."
    },
    {
      question: "What if I forget my password?",
      answer: "You can reset your password using the 'Forgot Password' link on the login page. We'll send you a secure reset link via email."
    },
    {
      question: "Any unusual problems faced",
      answer: "Reach out to us at our Service Desk"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about our resume builder</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                {openItems[index] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItems[index] && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;