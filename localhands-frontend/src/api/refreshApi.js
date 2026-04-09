import api from "./api";

export const refreshToken = async () => {
    try {
        const res = await api.post("/api/auth/refresh")
        return res.data
    } catch (error) {
        console.error("Failed to refresh token: ", error)
        throw error.response?.data || "Coudln't refresh token (oof)"
    }
}