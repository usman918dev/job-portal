import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import { getCurrentUser } from "../services/authService";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const {user} = useUser()
    const {getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    });

    const [isSearched, setIsSearched] = useState(false); // Changed setter to camelCase

    const [jobs , setJobs] = useState([]);

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [applications, setApplications] = useState([]);

    // Initialize currentUser from localStorage
    useEffect(() => {
        try {
            const storedUserData = getCurrentUser();
            console.log("AppContext - Stored user data:", storedUserData); // Debug log
            
            if (storedUserData && storedUserData.user) {
                // Our normalized response has { success: true, token: "...", user: {...} }
                const userToSet = {
                    ...storedUserData.user,
                    role: storedUserData.user.role || 'user' // Ensure role exists
                };
                console.log("AppContext - Setting currentUser to:", userToSet); // Debug log
                setCurrentUser(userToSet);
            }
        } catch (error) {
            console.error("Error initializing user from localStorage:", error);
            // Clear potentially corrupted data
            localStorage.removeItem('user');
        }
    }, []);

    // Function to Fetch Jobs data
    const fetchJobs = async () => {
      try {
        
        const {data} = await axios.get(backendUrl + '/api/jobs')

        if(data.success){
          setJobs(data.jobs)
          console.log(data.jobs);
        }
        else{
          console.log(data.message)
        }
        
      } catch (error) {
        console.log(error.message)
      }  
      
    }

  // Function to fetch user-specific applications
  const fetchApplications = async () => {
    try {
      if (!currentUser?.email) {
        return;
      }
      
      const {data} = await axios.get(backendUrl + `/api/applications/user/${currentUser.email}`)
      
      if(data.success){
        console.log('Fetched applications:', data.applications);
        // Make sure we properly identify rejected applications
        const processedApplications = data.applications.map(app => {
          // Create a new object for each application
          return {
            ...app,
            // Normalize status to handle case differences
            status: app.status ? 
              app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase() : 
              'Pending'
          };
        });
        setApplications(processedApplications);
      }
      else{
        console.log(data.message)
      }
    } catch (error) {
      console.log('No applications found for user')
      // Don't show error toast for applications fetch failure
      setApplications([])
    }
  }

useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (currentUser?.email) {
      fetchApplications();
    }
  }, [currentUser]);
  

    
    const value = {
        searchFilter, setSearchFilter,
        setIsSearched, isSearched,
        jobs, setJobs,
        showAuthModal, setShowAuthModal,
        currentUser, setCurrentUser,
        backendUrl, 
        applications, setApplications,
        fetchApplications
    }

    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}