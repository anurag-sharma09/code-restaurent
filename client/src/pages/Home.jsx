import React from 'react';
import { ShoppingBag, ChevronRight, Utensils, Star, Smartphone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Utensils size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">MenuFlow</span>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Login</Link>
          <Link to="/register" className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">Get Started</Link>
        </div>
      </nav>

      <main className="flex-grow">
        <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-8 border border-primary/20">
                <Star size={12} fill="currentColor" />
                <span>Next-Gen Restaurant Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                Digital Menus, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Reimagined.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Empower your restaurant with dynamic QR menus, instant updates, and a stunning UI that wows your customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-primary/30">
                    Create Your Menu <ChevronRight size={20} />
                </Link>
                <div className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700">
                    Explore Demo
                </div>
            </div>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Smartphone className="text-blue-500" />} 
                    title="Mobile-First Design" 
                    desc="Built for modern smartphones with butter-smooth scrolling and sticky tabs."
                />
                <FeatureCard 
                    icon={<Globe className="text-emerald-500" />} 
                    title="Dynamic Updates" 
                    desc="Update prices and availability in real-time without reprinting QR codes."
                />
                <FeatureCard 
                    icon={<ShoppingBag className="text-orange-500" />} 
                    title="Order Workflow" 
                    desc="Streamlined browsing experience designed to increase item engagement."
                />
            </div>
        </section>
      </main>
      
      <footer className="py-10 px-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        &copy; 2026 MenuFlow Platform. All rights reserved. Built with Antigravity.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all text-left group">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-700 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

export default Home;
