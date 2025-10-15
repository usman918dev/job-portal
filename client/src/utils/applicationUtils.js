/**
 * Calculate application statistics from applications array
 * @param {Array} applications - Array of application objects
 * @param {Object} pagination - Pagination object with totalApplications
 * @returns {Object} - Stats object with total, accepted, and pending counts
 */
export const getApplicationStats = (applications, pagination) => {
  // Filter out rejected applications from stats
  const activeApplications =
    applications?.filter(
      (app) => !app.status || app.status.toLowerCase() !== "rejected"
    ) || [];

  const stats = {
    total: pagination?.totalApplications || activeApplications.length,
    accepted: activeApplications.filter(
      (app) => app.status && app.status.toLowerCase() === "accepted"
    ).length,
    pending: activeApplications.filter(
      (app) => !app.status || app.status.toLowerCase() === "pending"
    ).length,
  };

  // Only log in development environment
  if (import.meta.env.DEV) {
    console.log("Application stats:", stats);
  }

  return stats;
};

/**
 * Filter applications based on selected status
 * @param {Array} applications - Array of application objects
 * @param {string} selectedStatus - Status filter ('all', 'accepted', 'pending')
 * @returns {Array} - Filtered applications array
 */
export const filterApplicationsByStatus = (applications, selectedStatus) => {
  if (selectedStatus === "all") {
    return applications?.filter(
      (app) => !app.status || app.status.toLowerCase() !== "rejected"
    ) || [];
  }

  return applications?.filter((app) => {
    if (selectedStatus === "pending") {
      return (
        !app.status ||
        (app.status && app.status.toLowerCase() === "pending")
      );
    }
    return (
      app.status &&
      app.status.toLowerCase() === selectedStatus.toLowerCase()
    );
  }) || [];
};