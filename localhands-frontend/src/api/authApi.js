import axios from "axios";

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/users/login',
            userData,
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }

        );

        return response.data;

    } catch (error) {
        console.error("Login error:", error);
        throw error.response?.data || "Login failed!";;
    }
}

export const getUserInfo = async () => {
    try {
        const res = await axios.get("http://localhost:8080/api/users", {
            withCredentials: true,
        })

        return res.data;
    } catch (error) {

        if (error.response?.status === 401) {
            try {
                const { refreshToken } = await import("./refreshApi");
                await refreshToken();
        
                //retry after refreshing token
                const res = await axios.get("http://localhost:8080/api/users", {
                    withCredentials: true,
                })
                return res.data;

            } catch (refreshError) {
                console.error("Token refresh failed: ", refreshError);
                throw refreshError.response?.data || "Session expired, please log in again!";
            }
        }

        console.error("Fetch user info failed: ", error);
        throw error.response?.data || "Failed to fetch user information!";
    }

}