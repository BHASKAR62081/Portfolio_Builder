# Portfolio Builder

A modern, full-featured resume builder application built with React and designed to work with MongoDB Atlas.

## Live link

- https://portfolio-builder-ykd1.vercel.app/

## Features

- **User Authentication**: Complete auth system with registration, login, email verification, and password reset
- **Resume Builder**: Intuitive section-based resume creation with live preview
- **PDF Export**: High-quality PDF generation for professional resumes
- **Cloud Sync**: Automatic saving to MongoDB Atlas with offline support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **ATS-Friendly**: Templates optimized for Applicant Tracking Systems

## Tech Stack

### Frontend
- React 18 with JSX
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation
- Axios for API calls
- jsPDF & html2canvas for PDF generation

### Backend (Required)
- Node.js with Express
- MongoDB Atlas for database
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email services

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Email service (Gmail recommended)

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
code .env
```

3. Update the `.env` file with your backend URL:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

### Backend Setup (Required)

You'll need to create a backend server with the following endpoints:

#### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/profile` - Get user profile

#### Resume Routes
- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/save-data` - Save resume data
- `GET /api/resumes/data` - Get resume data

### MongoDB Atlas Configuration

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Configure your backend with the connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-builder?retryWrites=true&w=majority
```

### Required Environment Variables (Backend)

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Features Overview

### Authentication System
- Secure user registration and login
- Email verification with OTP
- Password reset functionality
- JWT token-based authentication
- Protected routes

### Resume Builder
- Personal information section
- Work experience with date ranges
- Education history
- Skills categorization with proficiency levels
- Projects with links and technologies
- Real-time preview
- Collapsible sections for better UX

### Cloud Integration
- Automatic saving to MongoDB Atlas
- Offline support with local storage
- Online/offline status indicator
- Auto-sync when connection is restored

### PDF Generation
- High-quality PDF export
- Professional formatting
- ATS-friendly layout
- Custom filename based on user's name

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Toast)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── utils/              # Utility functions
└── main.jsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
