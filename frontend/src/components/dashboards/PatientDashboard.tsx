import { useEffect, useState } from 'react';
import { patientAPI, publicAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Patient, Doctor, CreateAppointmentRequest } from '../../types';
import { format } from 'date-fns';

export const PatientDashboard: React.FC = () => {
  const { userId } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState<CreateAppointmentRequest>({
    doctorId: 0,
    patientId: userId || 0,
    appointmentTime: '',
    reason: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, doctorsData] = await Promise.all([
          patientAPI.getProfile(),
          publicAPI.getAllDoctors(),
        ]);
        setPatient(patientData);
        setDoctors(doctorsData);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await patientAPI.createAppointment({
        ...appointmentForm,
        patientId: userId || 0,
      });
      setSuccess('Appointment created successfully!');
      setShowAppointmentForm(false);
      setAppointmentForm({
        doctorId: 0,
        patientId: userId || 0,
        appointmentTime: '',
        reason: '',
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Patient Dashboard
            </h2>
            <p className="text-green-100 text-lg">Manage your appointments and profile</p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      {patient && (
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <dt className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Name</dt>
                <dd className="text-lg font-semibold text-gray-900">{patient.name}</dd>
              </div>
              {patient.gender && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <dt className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Gender</dt>
                  <dd className="text-lg font-semibold text-gray-900">{patient.gender}</dd>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {patient.birthDate && (
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <dt className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Date of Birth</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {format(new Date(patient.birthDate), 'MMMM dd, yyyy')}
                  </dd>
                </div>
              )}
              {patient.bloodGroup && (
                <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                  <dt className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Blood Group</dt>
                  <dd className="text-lg font-semibold text-gray-900">{patient.bloodGroup.replace('_', ' ')}</dd>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Card */}
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
          </div>
          <button
            onClick={() => setShowAppointmentForm(!showAppointmentForm)}
            className={`px-6 py-2.5 font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 ${
              showAppointmentForm
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white hover:from-primary-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {showAppointmentForm ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Appointment
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-4 flex items-start space-x-3 animate-slide-up">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="text-sm font-semibold text-red-800">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 flex items-start space-x-3 animate-slide-up">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="text-sm font-semibold text-green-800">{success}</div>
          </div>
        )}

        {showAppointmentForm && (
          <form onSubmit={handleCreateAppointment} className="space-y-5 animate-slide-up">
            <div>
              <label htmlFor="doctorId" className="block text-sm font-semibold text-gray-700 mb-2">
                Select Doctor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <select
                  id="doctorId"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none"
                  value={appointmentForm.doctorId}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, doctorId: Number(e.target.value) })
                  }
                >
                  <option value={0}>Choose a doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="appointmentTime" className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="appointmentTime"
                  type="datetime-local"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                  value={appointmentForm.appointmentTime}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, appointmentTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Visit
              </label>
              <textarea
                id="reason"
                rows={4}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 resize-none"
                value={appointmentForm.reason}
                onChange={(e) =>
                  setAppointmentForm({ ...appointmentForm, reason: e.target.value })
                }
                placeholder="Describe your symptoms or reason for the appointment..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3.5 font-semibold text-white bg-gradient-to-r from-primary-600 to-cyan-600 rounded-xl hover:from-primary-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Book Appointment</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

