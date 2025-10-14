import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Briefcase, Award, Globe, Clock } from 'lucide-react';

const LandingStats = ({ setShowAuthModal, setAuthMode }) => {
  const handleGetStarted = () => {
    setAuthMode('Sign Up');
    setShowAuthModal(true);
  };

  const stats = [
    {
      number: "50,000+",
      label: "Active Job Listings",
      sublabel: "Updated daily",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "1M+",
      label: "Registered Users",
      sublabel: "Growing community",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "95%",
      label: "Success Rate",
      sublabel: "Job placement",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "500+",
      label: "Partner Companies",
      sublabel: "Trusted employers",
      icon: Award,
      color: "from-orange-500 to-red-500"
    },
    {
      number: "50+",
      label: "Countries",
      sublabel: "Global reach",
      icon: Globe,
      color: "from-indigo-500 to-purple-500"
    },
    {
      number: "24/7",
      label: "Support",
      sublabel: "Always here to help",
      icon: Clock,
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
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
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
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-medium mb-6 shadow-md"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Our Impact
          </motion.div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Millions Worldwide
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join a thriving ecosystem of career success. Our platform connects ambitious professionals with forward-thinking companies, creating meaningful career opportunities that drive both personal growth and business innovation. These numbers represent real people achieving real career milestones.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
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
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 text-center relative overflow-hidden">
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Number */}
                <motion.div
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
                >
                  {stat.number}
                </motion.div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {stat.label}
                </h3>

                {/* Sublabel */}
                <p className="text-sm text-gray-500 font-medium">
                  {stat.sublabel}
                </p>

                {/* Decorative element */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gray-200 rounded-full group-hover:bg-blue-300 transition-colors duration-300"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20 text-center"
        >
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Growing Every Day
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our platform continues to expand, connecting more job seekers with their ideal opportunities. 
              Be part of this success story.
            </p>
            
            {/* Mini stats row */}
            <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">150+</div>
                <div className="text-sm text-gray-500">New jobs daily</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">300+</div>
                <div className="text-sm text-gray-500">Successful matches daily</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-500">User satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingStats;