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

//IMPLEMENT GET PUBLIC USER PROFILE


//IMPLEMENT SEARCH PUBLIC USER

//IMPLEMENTS PROFILE UPDATE


//IMPLEMENT PRIVACY SETTINGS