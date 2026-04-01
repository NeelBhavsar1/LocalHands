import axios from "axios";

export const refreshToken = async () => {
    try {
        const res = await axios.post(
            'http://localhost:8080/api/auth/refresh',
            {},
            { withCredentials: true}
        );
        return res.data;
    } catch (error) {
        console.error("Refresh token failed: ", error);
        throw error.response?.data || "Could not refresh token!";
    }
}