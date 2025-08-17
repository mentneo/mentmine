import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { 
  FaHome, FaCalendarAlt, FaUsers, FaUserTie, FaComments, 
  FaSignOutAlt, FaBars, FaTimes, FaBook, FaStar, FaEnvelope
} from 'react-icons/fa';
import DashboardOverview from '../components/admin/DashboardOverview';
import EventsManagement from '../components/admin/EventsManagement';
import ReviewsManagement from '../components/admin/ReviewsManagement';
import TeamManagement from '../components/admin/TeamManagement';
import UserManagement from '../components/admin/UserManagement';
import CoursesManagement from '../components/admin/CoursesManagement';
import HiringRequests from './admin/HiringRequests';
import ContactMessages from './admin/ContactMessages';
import PortfolioManagement from './admin/PortfolioManagement';
import ServicesManagement from './admin/ServicesManagement';
import CertificateGenerator from './admin/CertificateGenerator';
import CertificateHistory from './admin/CertificateHistory';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Added currentUser state
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname;

  useEffect(() => {
    // Get the current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const userSnapshot = await getDocs(usersQuery);
        const usersData = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserData(usersData);
        
        // Fetch contact messages
        const messagesQuery = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesData = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toISOString() || null
        }));
        setMessages(messagesData);
        
        // Fetch analytics data
        const analyticsQuery = collection(db, 'analytics');
        const analyticsSnapshot = await getDocs(analyticsQuery);
        const analyticsObj = {};
        
        analyticsSnapshot.forEach(doc => {
          analyticsObj[doc.id] = doc.data();
        });
        
        setAnalyticsData(analyticsObj);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome className="mr-2" /> },
    { path: '/admin/users', label: 'Users', icon: <FaUsers className="mr-2" /> },
    { path: '/admin/courses', label: 'Courses', icon: <FaBook className="mr-2" /> },
    { path: '/admin/events', label: 'Events', icon: <FaCalendarAlt className="mr-2" /> },
    { path: '/admin/portfolio', label: 'Portfolio', icon: <FaStar className="mr-2" /> },
    { path: '/admin/services', label: 'Services', icon: <FaStar className="mr-2" /> },
    { path: '/admin/certificates', label: 'Generate Certificate', icon: <FaStar className="mr-2" /> },
    { path: '/admin/certificates/history', label: 'Certificate History', icon: <FaStar className="mr-2" /> },
    { path: '/admin/hiring-requests', label: 'Hiring Requests', icon: <FaUserTie className="mr-2" /> },
    { path: '/admin/contact-messages', label: 'Contact Messages', icon: <FaEnvelope className="mr-2" /> },
    { path: '/admin/team', label: 'Team', icon: <FaUserTie className="mr-2" /> },
    { path: '/admin/reviews', label: 'Reviews', icon: <FaComments className="mr-2" /> }
  ];
  
  const isActive = (path) => {
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    return currentPath.startsWith(path) && path !== '/admin';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className="lg:hidden">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20" 
             style={{ display: sidebarOpen ? 'block' : 'none' }}
             onClick={() => setSidebarOpen(false)}></div>
        
        <div className={`fixed inset-y-0 left-0 transition-all duration-300 transform z-30 w-64 bg-blue-900 text-white ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="flex items-center space-x-2">
              <img src="/MENTNEO.png" alt="Mentneo Admin" className="h-8 w-auto" />
              <span className="font-semibold text-lg">Mentneo Admin</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-blue-300 focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          
          <nav className="mt-5 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 mt-2 text-sm rounded-md ${
                  isActive(item.path)
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 mt-5 text-sm text-blue-100 rounded-md hover:bg-blue-800 hover:text-white w-full"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </nav>
        </div>
      </div>
      
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-blue-900 text-white">
          <div className="flex items-center h-16 px-4 border-b border-blue-800">
            <img src="/MENTNEO.png" alt="Mentneo Admin" className="h-8 w-auto" />
            <span className="ml-2 font-semibold text-lg">Mentneo Admin</span>
          </div>
          
          <nav className="flex-1 px-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 mt-2 text-sm rounded-md ${
                  isActive(item.path)
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="flex-shrink-0 p-4 border-t border-blue-800">
            <div className="flex items-center">
              <div>
                <div className="text-sm font-medium text-white">{currentUser?.email || 'Admin User'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 mt-5 text-sm text-blue-100 rounded-md hover:bg-blue-800 hover:text-white w-full"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden px-4 text-gray-500 focus:outline-none"
          >
            <FaBars />
          </button>
          
          <div className="flex-1 flex items-center justify-end px-4">
            <div className="text-sm text-gray-600">
              Welcome, Admin
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<DashboardOverview userData={userData} messagesData={messages} analyticsData={analyticsData} />} />
              <Route path="/users" element={<UserManagement userData={userData} />} />
              <Route path="/courses" element={<CoursesManagement />} />
              <Route path="/events" element={<EventsManagement />} />
              <Route path="/portfolio" element={<PortfolioManagement />} />
              <Route path="/services" element={<ServicesManagement />} />
              <Route path="/certificates" element={<CertificateGenerator />} />
              <Route path="/certificates/history" element={<CertificateHistory />} />
              <Route path="/hiring-requests" element={<HiringRequests />} />
              <Route path="/contact-messages" element={<ContactMessages />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/reviews" element={<ReviewsManagement />} />
              <Route path="*" element={<h1 className="text-2xl font-semibold">Page Not Found</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
