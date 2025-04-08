# Net Pathway

A platform connecting students with career opportunities and bridging the education-employment gap in Africa.

![Net Pathway Platform](https://res.cloudinary.com/datqh1mc9/image/upload/v1742629780/net-pathway/ifjj5fgmufgleyxfh4uk.png)

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Assessment System](#assessment-system)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

Net Pathway helps students make informed career choices by aligning their skills and interests with market opportunities. We address common challenges in career guidance and educational pathways to reduce skill mismatches and improve employment outcomes specifically for African youth.

## System Architecture

The system is built using a modern full-stack architecture:

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **State Management**: Zustand for client-side state management
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google OAuth via Passport.js
- **File Storage**: Cloudinary for image uploads
- **Form Management**: React Hook Form with Zod validation

## Features

- **User Authentication & Authorization**
  - Email/password registration and login
  - Google OAuth integration
  - Role-based access control (user, mentor, admin)
  - Email verification system

- **Assessment System**
  - Academic transcript analysis
  - Extracurricular activities assessment
  - Behavioral/personality assessment
  - Career path generation based on assessment results

- **Career Path Guidance**
  - University and program matching based on student profile
  - Personalized recommendations
  - Educational resource connections

- **Mentorship Platform**
  - Mentor profiles and expertise matching
  - Mentorship application system
  - Direct messaging system

- **Blog and Knowledge Sharing**
  - Career-focused articles
  - University program information
  - Industry insights

- **Admin Dashboard**
  - User management
  - Content moderation
  - System statistics and analytics

## Getting Started

### Prerequisites

- **Node.js** >= 16.0.0
- **MongoDB** >= 4.4
- **npm** or **yarn**
- **Git**

### Environment Setup

#### Frontend Environment Variables

Create a `.env.local` file in the `net-pathway` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Backend Environment Variables

Create a `.env` file in the `net-pathway-backend` directory:

```
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/net-pathway

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
API_URL=http://localhost:5000

# Email Configuration (for verification)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=noreply@netpathway.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Admin Domain Filtering (comma-separated list)
ALLOWED_ADMIN_DOMAINS=admin.netpathway.com,netpathway.org
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/net-pathway.git
cd net-pathway
```

2. Install frontend dependencies:

```bash
# From the project root
cd net-pathway
npm install
# or
yarn install
```

3. Install backend dependencies:

```bash
# From the project root
cd net-pathway-backend
npm install
# or
yarn install
```

## Running the Application

### Development Mode

#### Start the Backend Server:

```bash
# From net-pathway-backend directory
npm run dev
# or
yarn dev
```

This will start the backend server using nodemon, which will automatically restart when changes are detected.

#### Start the Frontend Server:

```bash
# From net-pathway directory
npm run dev
# or
yarn dev
```

This will start the Next.js development server, accessible at `http://localhost:3000`.

### Production Mode

#### Build and Start the Backend:

```bash
# From net-pathway-backend directory
npm run build
npm start
# or
yarn build
yarn start
```

#### Build and Start the Frontend:

```bash
# From net-pathway directory
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

### Frontend Structure

```
net-pathway/
├── app/                    # App Router pages and layouts
│   ├── (authenticated)/    # Authenticated routes
│   ├── (public)/           # Public routes
│   ├── auth/               # Authentication pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── admin/              # Admin dashboard components
│   ├── assessment/         # Assessment system components
│   ├── ui/                 # Reusable UI components
│   └── ...
├── lib/                    # Utility functions and helpers
├── public/                 # Static assets
├── store/                  # Zustand state management
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
└── ...
```

### Backend Structure

```
net-pathway-backend/
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── services/           # Business logic services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── server.ts           # Entry point
├── tests/                  # Test files
└── ...
```

## API Documentation

### Core API Endpoints

#### Authentication Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login with email and password
- `GET /api/users/auth/google` - Google OAuth login
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Assessment Endpoints

- `POST /api/assessment/academic-transcript` - Save academic data
- `POST /api/assessment/extracurricular` - Save extracurricular data
- `POST /api/assessment/behavioral` - Save behavioral assessment data
- `GET /api/assessment/status` - Get assessment completion status
- `GET /api/assessment/combined-data` - Get combined assessment data for path generation

#### Mentor Endpoints

- `GET /api/mentors` - Get all mentors
- `GET /api/mentors/:mentorId` - Get mentor by ID
- `POST /api/mentors` - Create a mentor profile
- `PUT /api/mentors/:mentorId` - Update mentor profile

#### Blog Endpoints

- `GET /api/blogs/published` - Get published blog posts
- `GET /api/blogs/:postId` - Get blog post by ID
- `POST /api/blogs` - Create a blog post
- `PUT /api/blogs/:postId` - Update a blog post

#### Chat Endpoints

- `POST /api/chat/mentor/:mentorId` - Initialize or get chat with mentor
- `GET /api/chat` - Get all user chats
- `POST /api/chat/:chatId/messages` - Send message in a chat

#### Admin Endpoints

- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/create-admin` - Create admin user (admin only)
- `PUT /api/admin/user-role` - Update user role (admin only)
- `GET /api/admin/statistics/statistics` - Get dashboard statistics (admin only)

## Authentication

The system uses JWT (JSON Web Tokens) for authentication with HTTP-only cookies for secure storage. Google OAuth is also supported for convenient sign-in.

For protected routes, the `requireAuth` middleware checks for a valid token in:
1. Cookies (preferred)
2. Authorization header (`Bearer token`)

Role-based authorization is implemented with the `requireAdmin` middleware for admin-only routes.

## Assessment System

The assessment system consists of three main components:

1. **Academic Transcript Assessment**
   - Subject grades and performance
   - GPA calculation
   - Academic strengths identification

2. **Extracurricular Activities Assessment**
   - Leadership roles and positions
   - Skills demonstrated in activities
   - Interest areas revealed through participation

3. **Behavioral Assessment**
   - RIASEC personality traits assessment
   - Multiple intelligence evaluation
   - Work style preferences

After completion of all assessment components, the system generates personalized career paths with university program matches.

## Deployment

### Backend Deployment

The backend can be deployed to any Node.js hosting service:

1. **Railway/Render/Heroku**:
   - Connect your repository
   - Set environment variables
   - Deploy the `net-pathway-backend` directory

2. **Traditional VPS**:
   - Set up Node.js and MongoDB
   - Clone the repository
   - Install dependencies
   - Set up environment variables
   - Use PM2 for process management

### Frontend Deployment

The Next.js frontend can be deployed to:

1. **Vercel** (recommended):
   - Connect your repository
   - Set environment variables
   - Deploy the `net-pathway` directory

2. **Netlify/Cloudflare Pages**:
   - Connect your repository
   - Set build command to `cd net-pathway && npm run build`
   - Set environment variables

## Testing

### Running Backend Tests

```bash
# From net-pathway-backend directory
npm test
# or
npm run test:watch
```

### Running Frontend Tests

```bash
# From net-pathway directory
npm test
# or
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```
   git push origin feature/your-feature-name
   ```
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

For more information, contact [c.asmamaw@alustudent.com](mailto:c.asmamaw@alustudent.com)
