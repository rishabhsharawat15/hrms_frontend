import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, LayoutDashboard, Briefcase, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/employees', label: 'Employees', icon: Users },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className={`
        fixed lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:shrink-0
        inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-gray-200 hidden lg:flex items-center gap-2 text-primary-600">
                        <Briefcase size={28} />
                        <h1 className="text-xl font-bold">HRMS Lite</h1>
                    </div>

                    <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
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

                    <div className="p-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">Admin Panel v1.0</p>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-primary-600">
                        <Briefcase size={24} />
                        <h1 className="text-lg font-bold">HRMS Lite</h1>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;