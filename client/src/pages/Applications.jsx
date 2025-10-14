import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, File, Briefcase, TrendingUp, Calendar, MapPin, Clock, Eye, CheckCircle, AlertCircle, User, BarChart3, Home } from "lucide-react";

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext(AppContext);
  const { backendUrl, currentUser } = context;

  // Function to fetch applications with pagination
  const fetchApplications = async (page = 1) => {
    try {
      setIsLoading(true);
      console.log('Fetching applications for currentUser:', currentUser);
      console.log('User email:', currentUser?.email);

      if (!currentUser?.email) {
        console.log('No user email found, skipping fetch');
        setApplications([]);
        setPagination(null);
        setIsLoading(false);
        return;
      }

      const url = `${backendUrl}/api/applications/user/${currentUser.email}?page=${page}&limit=5`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.success) {
        // Process applications and normalize status
        const processedApplications = data.applications.map(app => ({
          ...app,
          status: app.status ?
            app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase() :
            'Pending'
        }));

        console.log('Setting applications:', processedApplications);
        setApplications(processedApplications);
        setPagination(data.pagination);
      } else {
        console.log('API returned success=false:', data.message);
        setApplications([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case "Accepted":
        return { 
          bg: "bg-emerald-500/10", 
          text: "text-emerald-400", 
          border: "border-emerald-500/20",
          icon: CheckCircle,
          glow: "shadow-emerald-500/20"
        };

      default:
        return { 
          bg: "bg-amber-500/10", 
          text: "text-amber-400", 
          border: "border-amber-500/20",
          icon: AlertCircle,
          glow: "shadow-amber-500/20"
        };
    }
  };

  const getStatusStats = () => {
    // Filter out rejected applications from stats
    const activeApplications = applications?.filter(app => !app.status || app.status.toLowerCase() !== 'rejected') || [];

    const stats = {
      total: pagination?.totalApplications || activeApplications.length,
      accepted: activeApplications.filter(app => app.status && app.status.toLowerCase() === 'accepted').length,
      pending: activeApplications.filter(app => !app.status || app.status.toLowerCase() === 'pending').length
    };
    console.log('Application stats:', stats);
    return stats;
  };

  const stats = getStatusStats();
  const filteredApplications = selectedStatus === 'all' 
    ? applications?.filter(app => !app.status || app.status.toLowerCase() !== 'rejected') || []
    : applications?.filter(app => {
        if (selectedStatus === 'pending') {
          return !app.status || (app.status && app.status.toLowerCase() === 'pending');
        }
        return app.status && app.status.toLowerCase() === selectedStatus.toLowerCase();
      }) || [];
      
  // Only log in development environment
  if (import.meta.env.DEV) {
    console.log('Current status filter:', selectedStatus);
    console.log('Filtered applications:', filteredApplications);
  }


  
  // Fetch applications when component mounts or page changes
  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage, currentUser?.email]);

  
  // Log the applications for debugging - only in development
  useEffect(() => {
    if (import.meta.env.DEV && applications?.length > 0) {
      console.log('All applications:', applications);
    }
  }, [applications]);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Home Button */}
      <motion.button
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 left-4 z-50 flex items-center px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/80 hover:border-slate-600/50 transition-all duration-300 shadow-lg"
      >
        <Home className="w-4 h-4 mr-2" />
        Home
      </motion.button>
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={cardVariants}
          className="mb-12 text-center"
        >
          <h1 className="text-6xl mt-20 font-bold text-white mb-4">
            Application Dashboard
          </h1>
          <p className="text-slate-400 text-lg">Track your career journey with precision</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={cardVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {[
            { label: "Total Applications", value: stats.total, icon: Briefcase, color: "from-slate-600 to-slate-700" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle, color: "from-emerald-600 to-emerald-700" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "from-amber-600 to-amber-700" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl from-blue-600/20 to-purple-600/20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-white text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Animated progress bar */}
                <div className="mt-4 w-full bg-slate-700/50 rounded-full h-1.5">
                  <motion.div 
                    className={`h-1.5 bg-gradient-to-r ${stat.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stat.value / Math.max(stats.total, 1)) * 100, 100)}%` }}
                    transition={{ delay: index * 0.1 + 0.8, duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Resume Information */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -2 }}
          className="mb-8 group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Resume Information</h3>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-100 text-sm leading-relaxed">
                  When you apply for a job, you will have to add your uploaded resume drive link there.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Applications Section */}
        <motion.div
          variants={cardVariants}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="flex items-center mb-4 lg:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Application Tracker</h3>
                    <p className="text-slate-400">Monitor your progress</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['all', 'accepted', 'pending'].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setCurrentPage(1); // Reset to first page when filtering
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedStatus === status
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-slate-400">Loading applications...</p>
                  </motion.div>
                ) : filteredApplications?.length > 0 ? (
                  <motion.div
                    key="applications"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {filteredApplications.map((job, index) => {
                      const statusConfig = getStatusConfig(job.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <motion.div
                          key={job.id || index}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                          
                          <div className="relative flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-slate-600/50 flex items-center justify-center overflow-hidden border border-slate-500/30">
                                  <Briefcase className="w-6 h-6 text-slate-400" />
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">
                                  {job.jobId?.title || "Job Application"}
                                </p>
                                <p className="text-slate-400 text-sm">
                                  Application submitted
                                </p>
                                <div className="flex items-center text-xs text-slate-500 mt-1 space-x-4">
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {moment(job.createdAt).format("MMM DD, YYYY")}
                                  </div>
                                  {job.coverLetter && (
                                    <div className="flex items-center">
                                      <FileText className="w-3 h-3 mr-1" />
                                      Cover Letter
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border backdrop-blur-sm`}>
                                <StatusIcon className="w-3 h-3 mr-1.5" />
                                {job.status || "Pending"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotateY: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                    >
                      <Briefcase className="w-8 h-8 text-slate-300" />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {selectedStatus === 'all' ? 'No applications yet' : `No ${selectedStatus} applications`}
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                      {selectedStatus === 'all' 
                        ? 'Start your journey by applying to exciting opportunities'
                        : `You don't have any ${selectedStatus} applications at the moment`
                      }
                    </p>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      Explore Opportunities
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Pagination Controls */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center items-center space-x-2"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
                if (pageNum > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pageNum === pagination.currentPage
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'text-slate-300 bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700/80'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Pagination Info */}
        {!isLoading && pagination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-sm text-slate-400"
          >
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalApplications} total applications)
          </motion.div>
        )}
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Applications;