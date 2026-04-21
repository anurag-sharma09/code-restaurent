import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurant } from '../features/restaurant/restaurantSlice';
import { 
    Search, 
    Filter, 
    ChevronRight, 
    Star, 
    MapPin, 
    Clock, 
    Info, 
    Utensils,
    X,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PublicMenu = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { restaurant, isLoading } = useSelector((state) => state.restaurant);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
    const [showItemDetail, setShowItemDetail] = useState(null);
    const categoryRefs = useRef({});

    useEffect(() => {
        dispatch(getRestaurant(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (restaurant?.categories?.length > 0 && !activeCategory) {
            setActiveCategory(restaurant.categories[0]._id);
        }
    }, [restaurant, activeCategory]);

    const scrollToCategory = (categoryId) => {
        setActiveCategory(categoryId);
        const element = document.getElementById(`category-${categoryId}`);
        if (element) {
            const yOffset = -120; 
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const filteredCategories = restaurant?.categories?.map(cat => ({
        ...cat,
        items: cat.items?.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items?.length > 0) || [];

    if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    if (!restaurant) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white text-xl">Restaurant not found or coming soon.</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-primary/20">
            {/* Banner Section */}
            <header className="relative h-64 md:h-80 overflow-hidden">
                <img 
                    src={restaurant.images?.banner || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1000&q=80'} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white p-1 rounded-3xl shadow-2xl shrink-0 overflow-hidden">
                            <img src={restaurant.images?.logo || 'https://via.placeholder.com/150'} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                        </div>
                        <div className="text-white">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{restaurant.name}</h1>
                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-sm text-white/80 font-medium">
                                <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {restaurant.location}</span>
                                <span className="flex items-center gap-1"><Clock size={14} className="text-primary" /> {restaurant.openingHours}</span>
                                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /> 4.9 (500+)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sticky Navigation & Controls */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto">
                    <div className="px-6 py-4 flex items-center gap-4">
                        <div className="relative flex-grow group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search menu items..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-2xl outline-none text-sm dark:text-white"
                            />
                        </div>
                        <button 
                            onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
                            className="p-3 bg-gray-100 dark:bg-gray-900 rounded-2xl text-gray-500 transition-all active:scale-95"
                        >
                            {layout === 'grid' ? <ListIcon size={20} /> : <LayoutGrid size={20} />}
                        </button>
                    </div>

                    <div className="flex overflow-x-auto no-scrollbar gap-2 px-6 pb-4">
                        {restaurant.categories?.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => scrollToCategory(category._id)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                                    activeCategory === category._id 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                                        : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <main className="max-w-5xl mx-auto px-6 py-8 space-y-12 pb-32">
                {filteredCategories.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <Utensils size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No items found matching your search.</p>
                    </div>
                ) : (
                    filteredCategories.map((category) => (
                        <section key={category._id} id={`category-${category._id}`} className="space-y-6 scroll-mt-20">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase border-l-4 border-primary pl-4">{category.name}</h2>
                                <div className="h-[1px] flex-grow bg-gray-200 dark:bg-gray-800" />
                            </div>

                            <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6' : 'flex flex-col gap-4'}>
                                {category.items?.map((item) => (
                                    <div 
                                        key={item._id}
                                        onClick={() => setShowItemDetail(item)}
                                        className={`bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all cursor-pointer group shadow-sm hover:shadow-2xl ${layout === 'list' ? 'flex items-center gap-6' : ''}`}
                                    >
                                        <div className={`${layout === 'list' ? 'w-24 h-24' : 'w-full h-48'} overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-gray-800 mb-4 shrink-0 relative`}>
                                            <img src={item.image || 'https://via.placeholder.com/300'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            {item.popular && (
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black rounded-full shadow-lg">POPULAR</div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.name}</h3>
                                                <span className="text-lg font-black text-primary">${item.price}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {item.isVegetarian && <span className="w-4 h-4 border-2 border-green-500 p-0.5 flex items-center justify-center"><span className="w-2 h-2 bg-green-500 rounded-full" /></span>}
                                                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Best with Cold Beer</span>
                                                </div>
                                                <button className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-900 dark:text-white group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </main>

            {/* Quick Actions (Mobile) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-full shadow-2xl flex items-center gap-3 active:scale-95 transition-transform">
                    <Info size={18} /> Restaurant Info
                </button>
            </div>

            {/* Item Detail Modal */}
            <AnimatePresence>
                {showItemDetail && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowItemDetail(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden relative shadow-2xl"
                        >
                            <button onClick={() => setShowItemDetail(null)} className="absolute top-6 right-6 p-2 bg-black/20 text-white rounded-full z-10 hover:bg-black/40"><X size={20} /></button>
                            <div className="h-72 w-full overflow-hidden">
                                <img src={showItemDetail.image} alt={showItemDetail.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-3xl font-black dark:text-white">{showItemDetail.name}</h2>
                                        <span className="text-3xl font-black text-primary">${showItemDetail.price}</span>
                                    </div>
                                    <p className="text-gray-500 leading-relaxed">{showItemDetail.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                                         <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Calories</p>
                                         <p className="font-black dark:text-white">450 kcal</p>
                                     </div>
                                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                                         <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Preparation Time</p>
                                         <p className="font-black dark:text-white">15-20 min</p>
                                     </div>
                                </div>
                                <button className="w-full py-5 bg-primary text-white font-black rounded-[2rem] text-xl shadow-xl shadow-primary/30">Order Item</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PublicMenu;
