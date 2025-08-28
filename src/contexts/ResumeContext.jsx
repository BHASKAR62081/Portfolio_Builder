import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

const initialState = {
  personalInfo: { name: '', email: '', phone: '' },
  experience: [{ jobTitle: '', company: '', description: '' }],
  education: [{ degree: '', school: '' }],
  skills: [''],
};

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(initialState);

  // You would have functions here to update the resume data
  const updatePersonalInfo = (info) => {
    setResumeData(prev => ({ ...prev, personalInfo: info }));
  };
  
  // Add other update functions for experience, education, etc.

  const value = { resumeData, setResumeData, updatePersonalInfo };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};