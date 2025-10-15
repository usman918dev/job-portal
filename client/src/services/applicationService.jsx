// Application service for handling application-related API calls
const APPLICATIONS_PER_PAGE = 5;

/**
 * Fetch user applications with pagination
 * @param {string} backendUrl - The backend API URL
 * @param {Object} currentUser - Current user object with email
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} - Object containing applications array and pagination info
 */
export const fetchUserApplications = async (backendUrl, currentUser, page = 1) => {
  try {
    console.log("Fetching applications for currentUser:", currentUser);
    console.log("User email:", currentUser?.email);

    if (!currentUser?.email) {
      console.log("No user email found, skipping fetch");
      return {
        applications: [],
        pagination: null
      };
    }

    const url = `${backendUrl}/api/applications/user/${currentUser.email}?page=${page}&limit=${APPLICATIONS_PER_PAGE}`;
    console.log("Fetching from URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received data:", data);

    if (data.success) {
      // Process applications and normalize status
      const processedApplications = data.applications.map((app) => ({
        ...app,
        status: app.status
          ? app.status.charAt(0).toUpperCase() +
            app.status.slice(1).toLowerCase()
          : "Pending",
      }));

      console.log("Processed applications:", processedApplications);
      return {
        applications: processedApplications,
        pagination: data.pagination
      };
    } else {
      console.log("API returned success=false:", data.message);
      return {
        applications: [],
        pagination: null
      };
    }
  } catch (error) {
    console.error("Error fetching applications:", error);
    return {
      applications: [],
      pagination: null
    };
  }
};
