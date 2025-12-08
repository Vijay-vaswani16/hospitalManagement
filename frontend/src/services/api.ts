import axios from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignupResponse,
  Doctor,
  Patient,
  Appointment,
  CreateAppointmentRequest,
  OnboardDoctorRequest,
  User,
} from '../types';
import { getHighestRoleFromToken, getUsernameFromToken } from '../utils/jwt';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('api --> ', api);

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('token --> ', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  signup: async (data: SignUpRequest): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>('/auth/signup', data);
    return response.data;
  },
  // Get current user info - Note: This endpoint needs to be added to backend
  // For now, we'll use a workaround by trying to access role-specific endpoints
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Try to get user info by attempting to access patient profile
      // This is a workaround - ideally backend should have /auth/me endpoint
      const response = await api.get<Patient>('/patients/profile');
      // If successful, user is at least a patient
      // We'll determine roles based on what endpoints they can access
      return null; // Will be handled differently
    } catch (error) {
      return null;
    }
  },
};

export const publicAPI = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    const response = await api.get<Doctor[]>('/public/doctors');
    return response.data;
  },
};

export const patientAPI = {
  getProfile: async (): Promise<Patient> => {
    const response = await api.get<Patient>('/patients/profile');
    return response.data;
  },
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post<Appointment>('/patients/appointments', data);
    return response.data;
  },
};

export const doctorAPI = {
  getAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/doctors/appointments');
    return response.data;
  },
};

export const adminAPI = {
  getAllPatients: async (page: number = 0, size: number = 10): Promise<Patient[]> => {
    const response = await api.get<Patient[]>('/admin/patients', {
      params: { page, size },
    });
    return response.data;
  },
  onboardDoctor: async (data: OnboardDoctorRequest): Promise<Doctor> => {
    const response = await api.post<Doctor>('/admin/onBoardNewDoctor', data);
    return response.data;
  },
};

// Utility function to detect user role by trying to access role-specific endpoints
// Returns only ONE role with priority: ADMIN > DOCTOR > PATIENT
// Note: This is a workaround since the backend doesn't have a /auth/me endpoint
// In production, you should add a backend endpoint that returns the current user's role
export const detectUserRole = async (): Promise<string> => {
  const token = localStorage.getItem('token');
  const lastUsername = localStorage.getItem('lastUsername');

  // 1) Stored role (single-role system)
  const storedRole = localStorage.getItem('userRole');
  if (storedRole && ['ADMIN', 'DOCTOR', 'PATIENT'].includes(storedRole)) {
    return storedRole;
  }

  // 2) Cached role by username (from prior signup/login)
  if (lastUsername) {
    try {
      const raw = localStorage.getItem('userRoleByUsername');
      const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      const cached = map[lastUsername];
      if (cached && ['ADMIN', 'DOCTOR', 'PATIENT'].includes(cached)) {
        localStorage.setItem('userRole', cached);
        return cached;
      }
    } catch {
      // ignore cache errors
    }
  }

  // 3) Role from JWT (no network call)
  if (token) {
    const roleFromToken = getHighestRoleFromToken(token);
    if (roleFromToken) {
      localStorage.setItem('userRole', roleFromToken);
      return roleFromToken;
    }
  } else {
    return 'PATIENT';
  }

  // Create a temporary axios instance that doesn't redirect on 401/403
  const tempApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    validateStatus: () => true, // Don't throw on any status code
  });
  
  // Check roles in priority order: ADMIN > DOCTOR > PATIENT
  // Return the highest priority role found
  
  // 4) Try endpoints in priority order (fallback)
  // Admin
  try {
    const response = await tempApi.get('/admin/patients', { params: { page: 0, size: 1 } });
    if (response.status === 200) {
      return 'ADMIN';
    }
  } catch (error) {
    // Ignore errors
  }
  
  // Doctor
  try {
    const response = await tempApi.get('/doctors/appointments');
    if (response.status === 200) {
      return 'DOCTOR';
    }
  } catch (error) {
    // Ignore errors
  }

  // Patient (lowest)
  try {
    const response = await tempApi.get('/patients/profile');
    if (response.status === 200) {
      return 'PATIENT';
    }
  } catch (error) {
    // Ignore errors
  }
  
  // Default
  return 'PATIENT';
};

export default api;
