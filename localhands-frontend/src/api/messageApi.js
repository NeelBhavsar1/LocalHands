import api from "./api";

/**
 * Base URL for the LocalHands backend API
 * Used for direct API calls when needed and for configuration purposes
 */
const BACKEND_URL = 'http://localhost:8080';

/**
 * Retrieves the current user's message inbox
 * 
 * This function fetches all conversations for the authenticated user,
 * providing a summary of each conversation including the last message,
 * participant information, and unread message counts.
 * 
 * Endpoint: GET /api/messages/inbox
 * 
 * @returns {Promise<Array>} Array of conversation objects containing:
 *   - conversationId {string} - Unique conversation identifier
 *   - participant {Object} - Other user's information
 *     - id {string} - User ID
 *     - firstName {string} - User's first name
 *     - lastName {string} - User's last name
 *     - profilePhoto {string|null} - Profile photo URL
 *   - listing {Object} - Associated listing information
 *     - id {string} - Listing ID
 *     - title {string} - Listing title
 *   - lastMessage {Object} - Most recent message details
 *     - content {string} - Message text
 *     - timestamp {string} - Message creation time (ISO format)
 *     - senderId {string} - ID of message sender
 *   - unreadCount {number} - Number of unread messages
 *   - createdAt {string} - Conversation creation time
 *   - updatedAt {string} - Last activity time
 * 
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - Network connection fails
 *   - Server returns error response
 * 
 * @example
 * // Fetch user's inbox
 * try {
 *   const inbox = await getInbox();
 *   console.log(`You have ${inbox.length} conversations`);
 *   inbox.forEach(conversation => {
 *     console.log(`Chat with ${conversation.participant.firstName}: ${conversation.lastMessage.content}`);
 *   });
 * } catch (error) {
 *   console.error('Failed to load inbox:', error);
 * }
 */
export const getInbox = async () => {
    try {
        const res = await api.get("/api/messages/inbox")
        return res.data
    } catch (error) {
        console.error("Fetch inbox error: ", error)
        throw error.response?.data || "Failed to fetch inbox!"
    }
};

/**
 * Retrieves a specific conversation between the current user and another user
 * 
 * This function fetches the complete message history for a specific conversation,
 * including all messages exchanged between the current user and the specified participant
 * related to a particular listing.
 * 
 * Endpoint: GET /api/messages/conversation
 * 
 * @param {string} otherUserId - The ID of the other user in the conversation
 * @param {string} listingId - The ID of the listing associated with this conversation
 * 
 * @returns {Promise<Object>} Conversation object containing:
 *   - conversationId {string} - Unique conversation identifier
 *   - participants {Array} - Array of participant objects
 *     - id {string} - User ID
 *     - firstName {string} - User's first name
 *     - lastName {string} - User's last name
 *     - profilePhoto {string|null} - Profile photo URL
 *   - listing {Object} - Associated listing information
 *     - id {string} - Listing ID
 *     - title {string} - Listing title
 *     - category {string} - Listing category
 *   - messages {Array} - Array of message objects
 *     - id {string} - Message ID
 *     - senderId {string} - ID of message sender
 *     - content {string} - Message text content
 *     - timestamp {string} - Message creation time (ISO format)
 *     - isRead {boolean} - Message read status
 *   - createdAt {string} - Conversation creation time
 *   - updatedAt {string} - Last message time
 * 
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - Invalid user ID or listing ID (400)
 *   - Conversation doesn't exist (404)
 *   - Network connection fails
 *   - Server returns error response
 * 
 * @example
 * // Fetch conversation with specific user about a listing
 * try {
 *   const conversation = await getConversation('user123', 'listing456');
 *   console.log(`Conversation with ${conversation.participants[1].firstName}`);
 *   conversation.messages.forEach(msg => {
 *     console.log(`${msg.senderId === currentUser.id ? 'You' : msg.senderName}: ${msg.content}`);
 *   });
 * } catch (error) {
 *   console.error('Failed to load conversation:', error);
 * }
 */
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

/**
 * Sends a message to another user in the context of a specific listing
 * 
 * This function creates and sends a new message to the specified recipient
 * related to a particular listing. The message is added to the existing conversation
 * or creates a new conversation if one doesn't exist.
 * 
 * Endpoint: POST /api/messages
 * 
 * @param {string} recipientId - The ID of the user receiving the message
 * @param {string} listingId - The ID of the listing this message relates to
 * @param {string} message - The message content to send
 * 
 * @returns {Promise<Object>} Message object containing:
 *   - id {string} - Unique message identifier
 *   - senderId {string} - ID of the message sender (current user)
 *   - recipientId {string} - ID of the message recipient
 *   - listingId {string} - Associated listing ID
 *   - content {string} - Message text content
 *   - timestamp {string} - Message creation time (ISO format)
 *   - isRead {boolean} - Read status (false for new messages)
 *   - conversationId {string} - Conversation identifier
 * 
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - Recipient ID is invalid or doesn't exist (400)
 *   - Listing ID is invalid or doesn't exist (400)
 *   - Message content is empty or too long (400)
 *   - Network connection fails
 *   - Server returns error response
 * 
 * @example
 * // Send a message to another user
 * try {
 *   const message = await sendMessage('user123', 'listing456', 'Hello, I\'m interested in your service!');
 *   console.log('Message sent successfully:', message.id);
 * } catch (error) {
 *   console.error('Failed to send message:', error);
 * }
 */
export const sendMessage = async (recipientId, listingId, message) => {
    try {
        const res = await api.post("/api/messages", { recipientId, listingId, message })
        return res.data
    } catch (error) {
        console.error("Send message error: ", error)
        throw error.response?.data || "Failed to send message!"
    }
};

/**
 * Export the backend URL for use in other components
 * This allows direct API calls when the configured API instance
 * is not suitable for specific use cases.
 */
export { 
    BACKEND_URL 
}
