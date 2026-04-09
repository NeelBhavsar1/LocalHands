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

//updates profile information (bio)
export const updateProfileInfo = async (profileData) => {
    try {
        const res = await api.put("/api/users/profile", profileData)
        return res.data
    } catch (error) {
        console.error("Update profile info error: ", error)
        throw error.response?.data || "Failed to update profile information!"
    }
};

export const userApi = {
    getUserInfo,
    updateAccountInfo,
    deleteUserAccount,
    updatePrivacyInfo,
    updateProfileInfo
};