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
