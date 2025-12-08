"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CompanyProfilePage() {
    const params = useParams();
    const router = useRouter();
    const companyName = decodeURIComponent(params.id as string);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        // Ensure scrolling is enabled when visiting this page
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    // Mock Data based on company name (in real app, fetch from DB)
    const companyData = {
        name: companyName,
        tagline: "Innovating the Future of Technology",
        description: `Welcome to the official profile of ${companyName}. We are a leading provider of innovative solutions in the tech industry. Our mission is to deliver high-quality products that transform businesses and enhance user experiences.`,
        services: [
            { title: "Cloud Solutions", icon: "☁️", desc: "Scalable cloud infrastructure for your enterprise." },
            { title: "AI Integration", icon: "🤖", desc: "Smart AI agents to automate your workflow." },
            { title: "Cybersecurity", icon: "🔒", desc: "Top-tier security to protect your assets." },
            { title: "Data Analytics", icon: "pq", desc: "Insightful analytics to drive decision making." },
        ],
        portfolio: [
            { title: "Project Alpha", img: "https://picsum.photos/seed/alpha/600/400" },
            { title: "Project Beta", img: "https://picsum.photos/seed/beta/600/400" },
            { title: "Gamma System", img: "https://picsum.photos/seed/gamma/600/400" },
            { title: "Delta App", img: "https://picsum.photos/seed/delta/600/400" },
        ]
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
            {/* Navigation / Header */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        EXPO 2025
                    </h1>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                    >
                        ← Back to Hall
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black z-0" />
                <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=5')] bg-cover bg-center opacity-30" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
                            {companyData.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light">
                            {companyData.tagline}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Tabs */}
            <section className="container mx-auto px-6 py-12">
                <div className="flex gap-8 border-b border-white/10 mb-12">
                    {['overview', 'services', 'portfolio', 'contact'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-lg capitalize transition-colors relative ${activeTab === tab ? 'text-cyan-400' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="min-h-[400px]">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">About Us</h2>
                                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                                    {companyData.description}
                                </p>
                                <p className="text-gray-400 leading-relaxed">
                                    Founded with a vision to revolutionize the industry, {companyData.name} has consistently pushed the boundaries of what is possible. Our team of experts works tirelessly to create solutions that matter.
                                </p>
                            </div>
                            <div className="h-80 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/20 blur-[100px] group-hover:bg-blue-500/30 transition-colors" />
                                <span className="text-9xl font-bold opacity-10">{companyData.name[0]}</span>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'services' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {companyData.services.map((service, i) => (
                                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all group">
                                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                    <p className="text-gray-400 text-sm">{service.desc}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'portfolio' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-8">
                            {companyData.portfolio.map((item, i) => (
                                <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <h3 className="text-2xl font-bold">{item.title}</h3>
                                        <p className="text-cyan-400 text-sm">View Case Study →</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto bg-white/5 p-8 rounded-3xl border border-white/10">
                            <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Name" className="bg-black/40 border border-white/10 rounded-xl p-4 focus:border-cyan-500 outline-none transition-colors" />
                                    <input type="email" placeholder="Email" className="bg-black/40 border border-white/10 rounded-xl p-4 focus:border-cyan-500 outline-none transition-colors" />
                                </div>
                                <textarea placeholder="Message" rows={5} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-cyan-500 outline-none transition-colors" />
                                <button className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/25">
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
}
