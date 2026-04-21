import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getRestaurant } from '../../features/restaurant/restaurantSlice';
import { addCategory, addMenuItem, reorderMenu } from '../../features/menu/menuSlice';
import { 
    Plus, 
    MoreVertical, 
    Eye, 
    EyeOff, 
    GripVertical, 
    Edit2, 
    Trash2, 
    ChevronDown, 
    ChevronUp,
    Search,
    Filter,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const ManageMenu = () => {
    const dispatch = useDispatch();
    const { restaurant, isLoading: restaurantLoading } = useSelector((state) => state.restaurant);
    const [activeTab, setActiveTab] = useState('all');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        // In a real app, we'd fetch the specific restaurant owned by the user
        // For this demo, we'll fetch the first one found or use a static ID if we had one
        if (restaurant?._id) {
            dispatch(getRestaurant(restaurant._id));
        }
    }, [dispatch]);

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        dispatch(addCategory({ 
            restaurantId: restaurant._id, 
            name: newCategoryName,
            sequenceOrder: (restaurant.categories?.length || 0) + 1
        })).then(() => {
            setNewCategoryName('');
            setIsAddingCategory(false);
            dispatch(getRestaurant(restaurant._id));
        });
    };

    if (!restaurant) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <Plus size={32} />
                </div>
                <h3 className="text-xl font-bold dark:text-white">No Restaurant Found</h3>
                <p className="text-gray-500 max-w-xs mt-2">You need to set up your restaurant profile before managing your menu.</p>
                <Link to="/dashboard/restaurant" className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-bold">Set up Profile</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">Menu Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Organize your dishes, categories, and prices.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsAddingCategory(true)}
                        className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-all"
                    >
                        <Plus size={18} /> New Category
                    </button>
                    <button className="px-5 py-2.5 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                        <Plus size={18} /> Add Menu Item
                    </button>
                </div>
            </div>

            {/* Quick Stats & Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl w-full md:w-auto">
                    {['all', 'available', 'unavailable'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-grow md:flex-none px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            placeholder="Search menu items..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary rounded-2xl outline-none text-sm dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Category Addition Overlay */}
            {isAddingCategory && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex flex-col md:flex-row items-center gap-4"
                >
                    <input 
                        autoFocus
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Starters, Main Course, Drinks"
                        className="flex-grow px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none dark:text-white"
                    />
                    <div className="flex gap-2">
                        <button onClick={handleAddCategory} className="px-6 py-3 bg-primary text-white font-bold rounded-2xl">Create Category</button>
                        <button onClick={() => setIsAddingCategory(false)} className="px-6 py-3 text-gray-500 font-bold">Cancel</button>
                    </div>
                </motion.div>
            )}

            {/* Menu List */}
            <div className="space-y-8 pb-20">
                {restaurant.categories?.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-gray-400 font-medium">Your menu is empty. Start by adding a category.</p>
                    </div>
                ) : (
                    restaurant.categories?.map((category) => (
                        <div key={category._id} className="space-y-4">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 text-gray-300 cursor-grab hover:text-gray-600 transition-colors">
                                        <GripVertical size={20} />
                                    </div>
                                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">{category.name}</h2>
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold rounded-md">
                                        {category.items?.length || 0} ITEMS
                                    </span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={16} /></button>
                                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items?.map((item) => (
                                    <motion.div 
                                        key={item._id}
                                        whileHover={{ y: -4 }}
                                        className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden shrink-0 relative">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <UtensilsCrossed size={32} />
                                                    </div>
                                                )}
                                                {!item.available && (
                                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-white px-2 py-1 bg-red-500 rounded-full">SOLDOUT</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-gray-900 dark:text-white leading-snug">{item.name}</h4>
                                                        <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={16} /></button>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="font-extrabold text-primary">${item.price}</span>
                                                    <div className="flex gap-2">
                                                        <button className={`p-1.5 rounded-lg transition-colors ${item.available ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-300 hover:bg-gray-50'}`}>
                                                            <Eye size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <button className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] hover:border-primary hover:bg-primary/5 transition-all text-gray-400 hover:text-primary group">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-sm font-bold">Add Item to {category.name}</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageMenu;
