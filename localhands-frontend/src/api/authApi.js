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