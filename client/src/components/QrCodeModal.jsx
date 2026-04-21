import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, X, Share2, Clipboard, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QrCodeModal = ({ isOpen, onClose, restaurantId, restaurantName }) => {
    const qrRef = useRef();
    const menuUrl = `${window.location.origin}/menu/${restaurantId}`;
    const [copied, setCopied] = React.useState(false);

    const downloadQR = () => {
        const svg = document.getElementById('restaurant-qr');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width + 40;
            canvas.height = img.height + 100;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 20, 20);
            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(restaurantName, canvas.width / 2, img.height + 60);
            
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `${restaurantName}-QR.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(menuUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[3rem] p-8 relative shadow-2xl overflow-hidden"
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
                        
                        <div className="text-center space-y-6">
                            <div>
                                <h3 className="text-2xl font-black dark:text-white">Your Menu QR Code</h3>
                                <p className="text-gray-500 text-sm mt-1">Scan to open the digital menu directly</p>
                            </div>

                            <div className="mx-auto w-64 h-64 bg-white p-6 rounded-[2.5rem] shadow-inner border border-gray-100 flex items-center justify-center">
                                <QRCodeSVG 
                                    id="restaurant-qr"
                                    value={menuUrl} 
                                    size={200}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex-grow overflow-hidden px-2">
                                        <p className="text-xs text-gray-400 truncate">{menuUrl}</p>
                                    </div>
                                    <button 
                                        onClick={copyToClipboard}
                                        className="p-2 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-xl hover:text-primary transition-colors shrink-0"
                                    >
                                        {copied ? <Check size={18} className="text-emerald-500" /> : <Clipboard size={18} />}
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={downloadQR}
                                        className="flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                                    >
                                        <Download size={20} /> Download
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-gray-200 dark:border-gray-700">
                                        <Share2 size={20} /> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QrCodeModal;
