🎓 Career Findr
Multi-role career management platform connecting students, educational institutions, and companies for seamless course enrollment and job placement.

https://img.shields.io/badge/version-2.0.0-blue
https://img.shields.io/badge/react-19.1.1-blue

✨ Key Features
Multi-Role Platform:

👥 Students - Browse courses/jobs, apply, track applications, schedule interviews

🏫 Institutions - Manage courses, review applications, communicate with students

💼 Companies - Post jobs, review candidates, schedule interviews, export data

🔧 Admins - User management, platform stats, role impersonation

Advanced Capabilities:

🔔 Real-time notifications & messaging

📅 Calendar integration with interview scheduling

📁 File management (resumes, documents, images)

📊 Export to CSV, Excel, PDF, JSON

📱 Fully responsive design

🛠️ Tech Stack
Frontend: React 19.1.1, Vite, Material-UI, React Query
Backend: Firebase (Auth, Firestore, Storage)
Additional: React Hook Form, Recharts, PDF/Excel export

🚀 Quick Start
Prerequisites
Node.js 18+

Firebase account

Git

Installation
bash
# Clone repository
git clone https://github.com/Smokey053/Career-Findr.git
cd Career-Findr/client/career-findr

# Install dependencies
npm install

# Configure environment (create .env file)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config

# Start development server
npm run dev
Demo Admin Access
Email: admin@careerfindr.com

Password: admin123

🔥 Firebase Setup
Create Firebase Project at Firebase Console

Enable Services: Authentication (Email/Password), Firestore, Storage

Deploy Security Rules: See FIREBASE_SETUP_COMPLETE.md

Required Collections: users, notifications, events, chats, jobs, courses, applications

📁 Project Structure
text
Career-Findr/
├── client/career-findr/          # React frontend
│   ├── src/components/           # Reusable components
│   ├── src/contexts/             # Auth, Notifications, etc.
│   ├── src/pages/                # Role-specific pages
│   └── src/services/             # API & storage
├── backend/                      # Express.js (optional)
└── docs/                         # Documentation
📚 Documentation
FIREBASE_SETUP_COMPLETE.md - Complete Firebase configuration

FEATURES_IMPLEMENTATION.md - Detailed feature documentation

TESTING_CHECKLIST.md - 159 test cases covering all features

🚀 Deployment
bash
# Build and deploy to Firebase Hosting
npm run build
firebase deploy
Live URL: https://career-findr.web.app
Status: ✅ Production Ready | Version: 2.0.0
Live Demo: https://career-findr.web.app
