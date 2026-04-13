import api from "./api";

//gets current user info
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