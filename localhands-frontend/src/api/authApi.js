//contains the axios interceptor method providing baseurl
import api from "./api"


//user login
export const loginUser = async (userData) => {
    try {
        const res = await api.post("/api/users/login", userData);
        return res.data
    } catch (error) {
        console.error("Login error: ", error)
        throw error.response?.data || "Login failed!"
    }
}


//fetch user infor (dashboard section)
export const getUserInfo = async () => {
    try {
        const res = await api.get("/api/users")
        return res.data;
    } catch (error) {
        console.error("Fetch user info failed: ", error)
        throw error.response?.data || "Failed to fetch the user information!"
    }
}

//function to log user out (check backend code)
export const logoutUser = async () => {
    try {
        const res = await api.post("/api/users/logout")
        return res.data
    } catch (error) {
        console.error("Logout error: ", error)
        throw error.response?.data || "Logout failed! (bruh)";
    }
}