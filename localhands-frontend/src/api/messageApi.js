import api from "./api";

const BACKEND_URL = 'http://localhost:8080';

//handler to fetch inbox
export const getInbox = async () => {
    try {
        const res = await api.get("/api/messages/inbox")
        return res.data
    } catch (error) {
        console.error("Fetch inbox error: ", error)
        throw error.response?.data || "Failed to fetch inbox!"
    }
};

//handler to fetch conversation
export const getConversation = async (otherUserId, listingId) => {
    try {
        const res = await api.get("/api/messages/conversation", {
            params: { otherUserId, listingId }
        })
        return res.data
    } catch (error) {
        console.error("Fetch conversation error: ", error)
        throw error.response?.data || "Failed to fetch conversation!"
    }
};

//handler to send messages to other users
export const sendMessage = async (recipientId, listingId, message) => {
    try {
        const res = await api.post("/api/messages", { recipientId, listingId, message })
        return res.data
    } catch (error) {
        console.error("Send message error: ", error)
        throw error.response?.data || "Failed to send message!"
    }
};

export { 
    BACKEND_URL 
}
