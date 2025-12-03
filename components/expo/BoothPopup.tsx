import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface BoothPopupProps {
    booth: any;
    onClose: () => void;
}

export default function BoothPopup({ booth, onClose }: BoothPopupProps) {
    const [showContactForm, setShowContactForm] = useState(false);

    return (
        <AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-gray-900/80 backdrop-blur-xl border border-white/10 p-0 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-3xl w-full relative overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {!showContactForm ? (
                        <>
                            {/* Left: Visual/Brand */}
                            <div className="w-full md:w-1/3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 flex flex-col items-center justify-center border-r border-white/5 relative">
                                <div
                                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-6"
                                    style={{ backgroundColor: booth.color, boxShadow: `0 0 30px ${booth.color}40` }}
                                >
                                    {booth.name[0]}
                                </div>
                                <h3 className="text-xl font-bold text-white text-center mb-2">{booth.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Live Now
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="w-full md:w-2/3 p-8 relative z-0">
                                <h2 className="text-2xl font-bold text-white mb-1">About Us</h2>
                                <div className="h-1 w-12 bg-blue-500 rounded-full mb-4" />

                                <p className="text-gray-300 text-sm leading-relaxed mb-8">
                                    Welcome to the {booth.name} virtual experience. We are dedicated to pushing the boundaries of innovation.
                                    Our team is ready to discuss how our solutions can transform your business.
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="group relative px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2">
                                        <span>View Profile</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>

                                    <button className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Schedule Meeting
                                    </button>

                                    <button
                                        onClick={() => setShowContactForm(true)}
                                        className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        Message
                                    </button>

                                    <button className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Brochure
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full p-8 relative z-0">
                            <h3 className="text-2xl font-bold text-white mb-6">Contact {booth.name}</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Your Name" className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                                    <input type="email" placeholder="Your Email" className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <textarea placeholder="How can we help you?" rows={4} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                            </div>
                            <div className="flex gap-4 justify-end mt-8">
                                <button
                                    onClick={() => setShowContactForm(false)}
                                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert("Message Sent Successfully!");
                                        setShowContactForm(false);
                                    }}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 transition-all"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
