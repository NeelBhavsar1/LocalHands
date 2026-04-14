import api from "./api";

/**
 * Retrieves current user information from the authentication endpoint.
 * This function is primarily used to verify user authentication status and
 * fetch user profile data for UI rendering and conditional logic.
 * 
 * Endpoint: GET /api/users/me
 * 
 * @returns {Promise<Object>} User object containing:
 *   {
        "id": 17,
        "firstName": string,
        "lastName": string,
        "dateOfBirth": date,
        "email": string,
        "bio": string,
        "roles": [
            "BUYER",
            "SELLER"
        ],
        "profilePhoto": null,
        "publicProfile": true,
        "messagesEnabled": true,
    "emailConfirmed": true
    }
 * 
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - Network connection fails
 *   - Server returns error response
 * 
 * @example
 * // Check if user is logged in and get user data
 * try {
 *   const userData = await getUserInfo();
 *   console.log('Welcome back,', userData.firstName);
 *   // Update UI with user information
 * } catch (error) {
 *   console.log('User not logged in:', error);
 *   // Redirect to login page
 * }
 */
export const getUserInfo = async () => {
    try {
        const res = await api.get("/api/users/me")
        return res.data

    } catch (error) {
        console.error("Fetch user info failed: ", error)
        throw error.response?.data || "Failed to fetch user information!"
    }
};



//updates account information
export const updateAccountInfo = async (accountData) => {
    try {
        const res = await api.put("/api/users/account", accountData)
        return res.data
    } catch (error) {
        console.error("Update account info error: ", error)
        throw error.response?.data || "Failed to update account information!"
    }
};


//delete user account
export const deleteUserAccount = async () => {
    try {
        const res = await api.delete("/api/users")
        return res.data

    } catch (error) {
        console.error("Delete account error: ", error)
        throw error.response?.data || "Failed to delete account!"
    }
};

//updates privacy settings
export const updatePrivacyInfo = async (privacyData) => {
    try {
        const res = await api.put("/api/users/privacy", privacyData)
        return res.data
    } catch (error) {
        console.error("Update privacy info error: ", error)
        throw error.response?.data || "Failed to update privacy settings!"
    }
};

//updates profile information (bio + profile picture)
export const updateProfileInfo = async (profileData) => {
    try {
        const res = await api.put("/api/users/profile", profileData, {
            headers: { 'Content-Type': undefined }  // Let browser set multipart boundary
        })
        return res.data
    } catch (error) {
        console.error("Update profile info error: ", error)
        throw error.response?.data || "Failed to update profile information!"
    }
};

//gets public profile of another user by id
export const getPublicProfile = async (targetUserId) => {
    try {
        const res = await api.get(`/api/users/id?targetUserId=${targetUserId}`)
        return res.data
    } catch (error) {
        console.error("Fetch public profile failed: ", error)
        throw error.response?.data || "Failed to fetch public profile!"
    }
};

//search for public profiles
export const searchPublicProfiles = async (searchInput) => {
    try {
        const res = await api.get(`/api/users/search?searchInput=${encodeURIComponent(searchInput)}`)
        return res.data
    } catch (error) {
        console.error("Search public profiles failed: ", error)
        throw error.response?.data || "Failed to search public profiles!"
    }
};

export const userApi = {
    getUserInfo,
    updateAccountInfo,
    deleteUserAccount,
    updatePrivacyInfo,
    updateProfileInfo,
    getPublicProfile,
    searchPublicProfiles
};