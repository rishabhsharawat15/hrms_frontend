// src/components/Layout.jsx
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, LayoutDashboard, Briefcase } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/employees', label: 'Employees', icon: Users },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-10">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-primary-600">
                        <Briefcase size={28} />
                        <h1 className="text-xl font-bold">HRMS Lite</h1>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">Admin Panel v1.0</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;