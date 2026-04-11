//contains the axios interceptor method providing baseurl
import api from "./api"


//user login
export const loginUser = async (userData) => {
    try {
        const res = await api.post("/api/auth/login", userData);
        return res.data
        
    } catch (error) {
        console.error("Login error: ", error)
        throw error.response?.data || "Login failed!"
    }
}


//function to log user out (check backend code)
export const logoutUser = async () => {
    try {
        const res = await api.post("/api/auth/logout")
        return res.data

    } catch (error) {
        console.error("Logout error: ", error)
        throw error.response?.data || "Logout failed! (bruh)";
    }
}

//acctivate account via email token
export const activateAccount = async (token) => {
    try {
        const res = await api.get("/api/auth/activate-account", { params: { token } })
        return res.data
    } catch (error) {
        console.error("Activate account error: ", error)
        throw error.response?.data || "Account activation failed!"
    }
}

//deactivate/delete account via email token
export const deactivateAccount = async (token) => {
    try {
        const res = await api.get("/api/auth/deactivate-account", { params: { token } })
        return res.data
    } catch (error) {
        console.error("Deactivate account error: ", error)
        throw error.response?.data || "Account deactivation failed!"
    }
}

//confirm email via token
export const confirmEmail = async (token) => {
    try {
        const res = await api.get("/api/auth/confirm-email", { params: { token } })
        return res.data
    } catch (error) {
        console.error("Confirm email error: ", error)
        throw error.response?.data || "Email confirmation failed!"
    }
}
