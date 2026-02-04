import React from 'react';
import { FaVideo, FaRobot, FaMagic, FaChartLine, FaClock, FaDollarSign } from 'react-icons/fa';

const AIVideosSection = () => {
    // WhatsApp integration
    const phoneNumber = '919182146476'; // +91 9182146476
    const message = 'తక్కువ ఖర్చులో AI వీడియోలు కావాలా? 🤖🎥\nMentneo తో రీల్స్, యాడ్స్, ప్రొమో వీడియోలు సులభంగా తయారు చేస్తాం 🚀';

    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const features = [
        {
            icon: <FaRobot className="text-4xl" />,
            title: "AI-Powered Creation",
            description: "Generate professional videos using advanced AI technology in minutes"
        },
        {
            icon: <FaClock className="text-4xl" />,
            title: "Save Time",
            description: "Create videos 10x faster than traditional methods"
        },
        {
            icon: <FaDollarSign className="text-4xl" />,
            title: "Cost Effective",
            description: "No expensive equipment or production team needed"
        },
        {
            icon: <FaChartLine className="text-4xl" />,
            title: "Boost Engagement",
            description: "Increase customer engagement with compelling video content"
        }
    ];

    const videoTypes = [
        {
            title: "Product Demos",
            description: "Showcase your products with stunning AI-generated demonstrations",
            gradient: "from-purple-600 to-blue-600"
        },
        {
            title: "Marketing Ads",
            description: "Create eye-catching advertisements that convert viewers to customers",
            gradient: "from-pink-600 to-orange-600"
        },
        {
            title: "Training Videos",
            description: "Develop professional training content for your team",
            gradient: "from-green-600 to-teal-600"
        },
        {
            title: "Social Media",
            description: "Generate engaging content for all your social platforms",
            gradient: "from-indigo-600 to-purple-600"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-purple-600/30 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-purple-400/30">
                        <FaMagic className="text-yellow-400" />
                        <span className="text-sm font-semibold uppercase tracking-wider">AI Video Generation</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Create Stunning Videos for Your Business
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Transform your ideas into professional videos with the power of AI. No experience needed.
                    </p>
                </div>

                {/* Main Video Preview Card */}
                <div className="max-w-5xl mx-auto mb-20">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                        <div className="relative bg-gray-900 rounded-2xl p-8 border border-purple-500/30">
                            <div onClick={handleWhatsAppClick} className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                                {/* Video placeholder with play button */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
                                <div className="relative z-10 text-center">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 mx-auto border-2 border-white/30 hover:bg-white/20 transition-all cursor-pointer group-hover:scale-110">
                                        <FaVideo className="text-3xl text-white ml-1" />
                                    </div>
                                    <p className="text-lg font-semibold">See AI Videos in Action</p>
                                    <p className="text-sm text-gray-400 mt-2">Watch how businesses transform with AI-generated content</p>
                                </div>
                                {/* Animated particles */}
                                <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                                <div className="absolute bottom-20 right-20 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-500"></div>
                                <div className="absolute top-1/2 right-10 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-1000"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            onClick={handleWhatsAppClick}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/10 cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="text-purple-400 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Video Types */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-center mb-12">
                        Perfect for Every Business Need
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videoTypes.map((type, index) => (
                            <div
                                key={index}
                                onClick={handleWhatsAppClick}
                                className="group relative overflow-hidden rounded-xl p-6 cursor-pointer"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                <div className="relative z-10">
                                    <h4 className="text-xl font-bold mb-3">{type.title}</h4>
                                    <p className="text-sm text-white/90 leading-relaxed">{type.description}</p>
                                </div>
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-tl-full transform translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl">
                        <div className="bg-gray-900 rounded-2xl px-12 py-8">
                            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                Join thousands of businesses already using AI to create stunning video content
                            </p>
                            <button onClick={handleWhatsAppClick} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50">
                                Start Creating AI Videos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIVideosSection;
