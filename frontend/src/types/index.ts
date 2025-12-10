export enum RoleType {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}

export enum BloodGroupType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
  name: string;
  roles: RoleType[];
}

export interface SignupResponse {
  id: number;
  username: string;
}

export interface Patient {
  id: number;
  name: string;
  gender: string;
  birthDate: string;
  bloodGroup: BloodGroupType;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  email: string;
}

export interface Appointment {
  id: number;
  appointmentTime: string;
  reason: string;
  doctor: Doctor;
}

export interface CreateAppointmentRequest {
  doctorId: number;
  patientId: number;
  appointmentTime: string;
  reason: string;
}

export interface OnboardDoctorRequest {
  userId: number;
  specialization: string;
  name: string;
}

export interface User {
  id: number;
  username: string;
  roles: RoleType[];
}

export interface UserInfo {
  id: number;
  username: string;
  roles: RoleType[];
}

export interface LoginResponse {
  jwt: string;
  userId: number;
  patient?: Patient;
  roles: RoleType[];
}

