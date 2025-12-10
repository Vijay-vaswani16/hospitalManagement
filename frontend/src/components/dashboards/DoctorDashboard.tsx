import { useEffect, useState } from 'react';
import { doctorAPI } from '../../services/api';
import type { Appointment } from '../../types';
import { format } from 'date-fns';

export const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await doctorAPI.getAppointments();
        setAppointments(data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full"></div>
          </div>
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Doctor Dashboard
            </h2>
            <p className="text-blue-100 text-lg">View and manage your appointments</p>
          </div>
        </div>
      </div>

      {/* Appointments Card */}
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">My Appointments</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className="font-semibold text-primary-600">{appointments.length}</span> scheduled appointment{appointments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No appointments scheduled</p>
            <p className="text-gray-400 text-sm mt-1">Your upcoming appointments will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment, index) => (
                  <tr 
                    key={appointment.id} 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {format(new Date(appointment.appointmentTime), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(appointment.appointmentTime), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.reason || 'No reason provided'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
