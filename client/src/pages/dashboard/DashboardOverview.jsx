import React from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag, Eye, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const DashboardOverview = () => {
    const { user } = useSelector((state) => state.auth);

    const stats = [
        { name: 'Total Views', value: '2,845', icon: <Eye className="text-blue-500" />, change: '+12.5%', color: 'bg-blue-500' },
        { name: 'Menu Engagement', value: '78%', icon: <TrendingUp className="text-emerald-500" />, change: '+4.2%', color: 'bg-emerald-500' },
        { name: 'Saved Items', value: '412', icon: <ShoppingBag className="text-orange-500" />, change: '+18.1%', color: 'bg-orange-500' },
        { name: 'Unique Visitors', value: '1,280', icon: <Users className="text-purple-500" />, change: '+5.4%', color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    Welcome back, <span className="text-primary">{user?.name}</span>!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your restaurant today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                                {stat.icon}
                            </div>
                            <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                                {stat.change} <ArrowUpRight size={12} className="ml-0.5" />
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.name}</p>
                        <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 dark:text-white">Popular Items</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                        <img src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&q=80`} alt="Dish" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">Gourmet Burger Deluxe</h4>
                                        <p className="text-sm text-gray-500">Main Course • 120 orders this week</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">$18.50</p>
                                    <p className="text-xs text-emerald-500 font-bold">+12%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-xl shadow-primary/20 text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">QR Analytics</h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Your QR code has been scanned <b>450 times</b> this week. Most traffic comes from Table 4 and Entrance.
                        </p>
                    </div>
                    <div className="mt-8">
                        <button className="w-full py-4 bg-white text-primary font-bold rounded-2xl hover:scale-[1.02] transition-transform shadow-lg">
                            View Detailed Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
