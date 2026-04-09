
import api from "./api";

export const registerUser = async (userData) => {
    try {
        const response = await api.post(
            '/api/auth/register', userData, 
            {headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        return response.data;

    } catch (error) {
        throw error.response?.data || "Something went wrong!";
    }
    
};