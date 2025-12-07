# Quick Start Guide

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Backend Configuration

Make sure your Spring Boot backend is running on `http://localhost:8080` with the context path `/api/v1`.

If your backend runs on a different port or context path, update the `vite.config.ts` file:

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',
      changeOrigin: true,
    }
  }
}
```

## Features Overview

### Public Pages
- **Home**: Landing page with feature overview
- **Doctors**: Public listing of all available doctors
- **Login**: User authentication
- **Signup**: New user registration

### Protected Pages (Require Authentication)
- **Dashboard**: Role-based dashboard
  - **Patient Dashboard**: View profile and book appointments
  - **Doctor Dashboard**: View scheduled appointments
  - **Admin Dashboard**: Manage patients and onboard doctors

## User Roles

The system supports three roles:
- **PATIENT**: Default role for new signups
- **DOCTOR**: Can view their appointments
- **ADMIN**: Can manage all patients and onboard doctors

## API Integration

All API calls are handled through the `src/services/api.ts` file. The axios instance automatically:
- Adds JWT tokens to authenticated requests
- Handles 401 errors by redirecting to login
- Uses the correct base URL

## Customization

### Styling
The project uses Tailwind CSS. Customize colors and theme in `tailwind.config.js`.

### Routing
Add new routes in `src/App.tsx`.

### API Endpoints
Add new API methods in `src/services/api.ts`.

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your backend allows requests from `http://localhost:5173`.

### Authentication Issues
- Check that JWT tokens are being stored in localStorage
- Verify the backend JWT secret matches
- Ensure the backend is running and accessible

### API Connection Issues
- Verify the backend is running on the expected port
- Check the proxy configuration in `vite.config.ts`
- Ensure the backend context path matches `/api/v1`

