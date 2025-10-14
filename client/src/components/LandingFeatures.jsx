import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Shield, Zap, Target, Globe, Award, Clock } from 'lucide-react';

const LandingFeatures = ({ setShowAuthModal, setAuthMode }) => {
  const handleGetStarted = () => {
    setAuthMode('Sign Up');
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: Search,
      title: "Smart Job Matching",
      description: "Our AI-powered algorithm matches you with the perfect job opportunities based on your skills, experience, and preferences.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Top Companies",
      description: "Connect with leading companies across industries. From startups to Fortune 500, find your next career opportunity.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your personal information is protected with enterprise-grade security. Control who sees your profile and when.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Get notified immediately when new jobs matching your criteria are posted. Never miss an opportunity again.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Target,
      title: "Career Guidance",
      description: "Get personalized career advice and insights to help you make informed decisions about your professional journey.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Explore job opportunities worldwide. Find remote work or relocate to your dream destination with ease.",
      color: "from-teal-500 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6"
          >
            <Award className="w-4 h-4 mr-2" />
            Why Choose Jobly
          </motion.div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Land Your Dream Job
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Jobly is more than just a job board – it's your comprehensive career platform designed to connect talented professionals with their ideal opportunities. Our cutting-edge technology and personalized approach ensure you find not just any job, but the right job that aligns with your career goals and lifestyle preferences.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
                {/* Gradient border effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-xl shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 text-blue-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Join thousands of professionals</span>
              </div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ready to accelerate your career?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Start your journey today and discover opportunities that align with your goals and aspirations.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingFeatures;