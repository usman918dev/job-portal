import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { LANDING_TESTIMONIALS_CONSTANTS } from '../constants/landingTestimonialsConstants.js';
import { handleGetStarted, createNextSlideHandler, createPrevSlideHandler, createDotClickHandler } from '../utils/landingTestimonialsUtils.js';

const LandingTestimonials = ({ setShowAuthModal, setAuthMode }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = createNextSlideHandler(setCurrentIndex, LANDING_TESTIMONIALS_CONSTANTS.TESTIMONIALS.length);
  const prevSlide = createPrevSlideHandler(setCurrentIndex, LANDING_TESTIMONIALS_CONSTANTS.TESTIMONIALS.length);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
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
            className="inline-flex items-center px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 mr-2 fill-current" />
            Success Stories
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Community Says
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from professionals who have
            transformed their careers using Jobly's powerful platform.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {LANDING_TESTIMONIALS_CONSTANTS.TESTIMONIALS
            .slice(currentIndex * LANDING_TESTIMONIALS_CONSTANTS.CAROUSEL.ITEMS_PER_SLIDE, currentIndex * LANDING_TESTIMONIALS_CONSTANTS.CAROUSEL.ITEMS_PER_SLIDE + 6)
            .map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="group relative"
              >
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    <Quote className="w-12 h-12 text-blue-600" />
                  </div>

                  {/* Rating */}
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-gray-700 leading-relaxed mb-8 relative z-10">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-colors duration-300"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center items-center space-x-4 mt-12"
        >
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex space-x-2">
            {[...Array(Math.ceil(LANDING_TESTIMONIALS_CONSTANTS.TESTIMONIALS.length / LANDING_TESTIMONIALS_CONSTANTS.CAROUSEL.ITEMS_PER_SLIDE))].map((_, index) => (
              <button
                key={index}
                onClick={createDotClickHandler(setCurrentIndex, index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 text-blue-600">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Join the community</span>
              </div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ready to write your success story?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already transformed their
              careers with Jobly.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGetStarted(setAuthMode, setShowAuthModal)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
