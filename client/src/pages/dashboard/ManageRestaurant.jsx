import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRestaurant, getRestaurants, reset } from '../../features/restaurant/restaurantSlice';
import { Store, MapPin, Clock, Phone, Mail, Image as ImageIcon, Loader2, Save } from 'lucide-react';

const ManageRestaurant = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        openingHours: '',
        contactPhone: '',
        contactEmail: '',
        logo: '',
        banner: ''
    });

    const { name, description, location, openingHours, contactPhone, contactEmail, logo, banner } = formData;

    const dispatch = useDispatch();
    const { restaurants, isLoading, isSuccess, message } = useSelector((state) => state.restaurant);

    useEffect(() => {
        dispatch(getRestaurants());
    }, [dispatch]);

    useEffect(() => {
        if (restaurants && restaurants.length > 0) {
            const res = restaurants[0]; // For this MVP, assume one restaurant per owner
            setFormData({
                name: res.name || '',
                description: res.description || '',
                location: res.location || '',
                openingHours: res.openingHours || '',
                contactPhone: res.contactDetails?.phone || '',
                contactEmail: res.contactDetails?.email || '',
                logo: res.images?.logo || '',
                banner: res.images?.banner || ''
            });
        }
    }, [restaurants]);

    const onChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const data = {
            name, 
            description, 
            location, 
            openingHours, 
            contactDetails: { phone: contactPhone, email: contactEmail },
            images: { logo, banner }
        };
        dispatch(createRestaurant(data));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">Manage Restaurant</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your branding and contact information.</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <section className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                            <Store size={20} className="text-primary" />
                            <h3 className="font-bold dark:text-white">General Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Restaurant Name</label>
                                <input 
                                    name="name" value={name} onChange={onChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                                    placeholder="The Grand Bistro"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea 
                                    name="description" value={description} onChange={onChange} rows="3"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                                    placeholder="Tell us about your culinary journey..."
                                />
                            </div>
                        </div>
                    </section>

                    <section className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                            <MapPin size={20} className="text-primary" />
                            <h3 className="font-bold dark:text-white">Location & Hours</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Address</label>
                                <input 
                                    name="location" value={location} onChange={onChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                                    placeholder="123 Gourmet St, Foodie City"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Opening Hours</label>
                                <input 
                                    name="openingHours" value={openingHours} onChange={onChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                                    placeholder="9:00 AM - 10:00 PM"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                            <ImageIcon size={20} className="text-primary" />
                            <h3 className="font-bold dark:text-white">Branding</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Logo URL</label>
                                <input 
                                    name="logo" value={logo} onChange={onChange}
                                    className="w-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Banner URL</label>
                                <input 
                                    name="banner" value={banner} onChange={onChange}
                                    className="w-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Configuration</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageRestaurant;
