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

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  
  if (!token) {
    // Check stored role first
    const storedRole = localStorage.getItem('userRole');
    return storedRole && ['ADMIN', 'DOCTOR', 'PATIENT'].includes(storedRole) ? storedRole : 'PATIENT';
  }
  
  // Check stored role first (from signup) - this is most reliable
  const storedRole = localStorage.getItem('userRole');
  if (storedRole && ['ADMIN', 'DOCTOR', 'PATIENT'].includes(storedRole)) {
    // Verify the stored role by testing endpoint access
    // But trust the stored role if it was set during signup
    return storedRole;
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
  
  // Try admin endpoint first (highest priority)
  try {
    const response = await tempApi.get('/admin/patients', { params: { page: 0, size: 1 } });
    if (response.status === 200) {
      return 'ADMIN';
    }
  } catch (error) {
    // Ignore errors
  }
  
  // Try doctor endpoint (medium priority)
  // IMPORTANT: Check doctor endpoint BEFORE patient endpoint
  // because backend might create Patient entity for all users
  try {
    const response = await tempApi.get('/doctors/appointments');
    if (response.status === 200) {
      return 'DOCTOR';
    }
  } catch (error) {
    // Ignore errors - might fail if doctor has no appointments yet
  }
  
  // Try patient endpoint (lowest priority)
  // NOTE: This might succeed even for doctors if backend creates Patient entity for all users
  // So we only use this if doctor endpoint failed
  try {
    const response = await tempApi.get('/patients/profile');
    if (response.status === 200) {
      return 'PATIENT';
    }
  } catch (error) {
    // Ignore errors
  }
  
  // Default to PATIENT only if nothing else works
  return 'PATIENT';
};

export default api;
