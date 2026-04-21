import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Menu as MenuIcon, 
  Settings, 
  LogOut, 
  User, 
  ChevronLeft,
  QrCode,
  BarChart3,
  Plus
} from 'lucide-react';
import ManageRestaurant from './dashboard/ManageRestaurant';
import ManageMenu from './dashboard/ManageMenu';
import DashboardOverview from './dashboard/DashboardOverview';
import QrCodeModal from '../components/QrCodeModal';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { restaurants } = useSelector((state) => state.restaurant);
    const restaurant = restaurants?.[0]; // Assume first restaurant for owner
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const onLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'My Restaurant', path: '/dashboard/restaurant', icon: <UtensilsCrossed size={20} /> },
        { name: 'Manage Menu', path: '/dashboard/menu', icon: <MenuIcon size={20} /> },
        { name: 'Analytics', path: '/dashboard/analytics', icon: <BarChart3 size={20} /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
    ];

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col z-30`}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                        <UtensilsCrossed size={18} />
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl dark:text-white">MenuFlow</span>}
                </div>

                <nav className="flex-grow px-4 space-y-1 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                                (location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path)))
                                    ? 'bg-primary/10 text-primary font-bold' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <button 
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-3 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                    
                    <div className="mt-4 flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shrink-0">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate dark:text-white">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-20 -right-3 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm z-50 hover:bg-gray-50"
                >
                    <ChevronLeft size={14} className={`${!isSidebarOpen && 'rotate-180'} transition-transform`} />
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto overflow-x-hidden relative">
                <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 flex items-center justify-between px-8">
                    <h2 className="font-bold text-gray-800 dark:text-white">
                        {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />
                        <button 
                            onClick={() => setIsQRModalOpen(true)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <QrCode size={20} />
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                           <User size={18} />
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    <Routes>
                        <Route path="/" element={<DashboardOverview />} />
                        <Route path="/restaurant" element={<ManageRestaurant />} />
                        <Route path="/menu" element={<ManageMenu />} />
                        <Route path="*" element={<div className="text-center py-20 text-gray-400">Section coming soon...</div>} />
                    </Routes>
                </div>

                {restaurant && (
                    <QrCodeModal 
                        isOpen={isQRModalOpen}
                        onClose={() => setIsQRModalOpen(false)}
                        restaurantId={restaurant._id}
                        restaurantName={restaurant.name}
                    />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
