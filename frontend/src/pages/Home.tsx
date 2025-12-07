import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center animate-fade-in">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-600 sm:text-6xl md:text-7xl mb-6 animate-slide-up">
            Hospital Management
            <span className="block text-primary-600 mt-2">System</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl md:text-2xl leading-relaxed">
            Streamline your healthcare operations with our comprehensive management platform.
            <span className="block mt-2 text-gray-500">Manage patients, appointments, and medical records all in one place.</span>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="group relative px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-cyan-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Go to Dashboard
                  <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group relative px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-cyan-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-4 text-lg font-semibold text-primary-600 bg-white border-2 border-primary-600 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-cyan-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Patient Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Efficiently manage patient records, appointments, and medical history with our intuitive interface.
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Appointment Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Book and manage appointments seamlessly with our easy-to-use scheduling system.
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-primary-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-primary-600 rounded-xl shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Medical Records</h3>
              <p className="text-gray-600 leading-relaxed">
                Maintain comprehensive medical records and track patient history securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

