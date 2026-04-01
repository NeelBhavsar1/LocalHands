import axios from "axios";

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/users/register',
            userData, 
            {headers: 
                {'Content-Type': 'application/json'}, withCredentials: true
            }
        );
        return response.data;

    } catch (error) {
        throw error.response?.data || "Something went wrong!";
    }
    
};