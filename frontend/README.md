# Hospital Management System - Frontend

This is the React frontend for the Hospital Management System built with Spring Boot.

## Features

- **Authentication**: Login and Signup functionality with JWT token management
- **Patient Dashboard**: View profile and book appointments
- **Doctor Dashboard**: View and manage appointments
- **Admin Dashboard**: Manage patients and onboard new doctors
- **Public Doctors Listing**: Browse available doctors
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Configuration

The frontend is configured to proxy API requests to `http://localhost:8080/api/v1` by default. You can modify this in `vite.config.ts` if your backend runs on a different port.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── dashboards/      # Dashboard components for different roles
│   │   ├── Layout.tsx       # Main layout with navigation
│   │   └── ProtectedRoute.tsx
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   └── Doctors.tsx
│   ├── services/            # API service layer
│   │   └── api.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## API Endpoints Used

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `GET /api/v1/public/doctors` - Get all doctors (public)
- `GET /api/v1/patients/profile` - Get patient profile
- `POST /api/v1/patients/appointments` - Create appointment
- `GET /api/v1/doctors/appointments` - Get doctor's appointments
- `GET /api/v1/admin/patients` - Get all patients (admin)
- `POST /api/v1/admin/onBoardNewDoctor` - Onboard new doctor (admin)

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests via axios interceptors.

## Role-Based Access

The application supports three roles with full role-based access control:

- **PATIENT**: 
  - View profile information
  - Book appointments with doctors
  - Access patient-specific dashboard

- **DOCTOR**: 
  - View scheduled appointments
  - Access doctor-specific dashboard
  - Manage appointment schedules

- **ADMIN**: 
  - View and manage all patients (with pagination)
  - Onboard new doctors
  - Access admin dashboard
  - Full system access

### Role Detection

The frontend automatically detects user roles by attempting to access role-specific endpoints. Users can have multiple roles simultaneously, and the dashboard will show all relevant sections based on their roles.

### Role-Based Routes

- `/dashboard` - Shows all dashboards based on user roles
- `/patient/dashboard` - Patient-only dashboard (requires PATIENT role)
- `/doctor/dashboard` - Doctor dashboard (requires DOCTOR or ADMIN role)
- `/admin/dashboard` - Admin dashboard (requires ADMIN role)

### Protected Routes

- `ProtectedRoute`: Requires authentication
- `RoleProtectedRoute`: Requires authentication AND specific role(s)

## Development

The development server supports hot module replacement (HMR) for fast development. Changes to the code will automatically reload in the browser.

## License

This project is part of the Hospital Management System.

