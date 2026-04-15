/**
 * User API functions
 * 
 * This module provides user-related API calls including profile management,
 * account settings, privacy controls, and user search functionality.
 * Uses axios with automatic token refresh and error handling.
 */

import api from "./api";

/**
 * Retrieves current user information from the authentication endpoint.
 * This function is primarily used to verify user authentication status and
 * fetch user profile data for UI rendering and conditional logic.
 * 
 * Endpoint: GET /api/users/me
 * 
 * @returns {Promise<Object>} User object containing:
 *   {
        "id": 17,
        "firstName": string,
        "lastName": string,
        "dateOfBirth": date,
        "email": string,
        "bio": string,
        "roles": [
            "BUYER",
            "SELLER"
        ],
        "profilePhoto": null,
        "publicProfile": true,
        "messagesEnabled": true,
    "emailConfirmed": true
    }
 * 
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - Network connection fails
 *   - Server returns error response
 * 
 * @example
 * // Check if user is logged in and get user data
 * try {
 *   const userData = await getUserInfo();
 *   console.log('Welcome back,', userData.firstName);
 *   // Update UI with user information
 * } catch (error) {
 *   console.log('User not logged in:', error);
 *   // Redirect to login page
 * }
 */
export const getUserInfo = async () => {
    try {
        const res = await api.get("/api/users/me")
        return res.data

    } catch (error) {
        console.error("Fetch user info failed: ", error)
        throw error.response?.data || "Failed to fetch user information!"
    }
};



/**
 * Updates user's basic account information
 * 
 * Updates core account details such as name, email, and other
 * personal information. This endpoint typically requires email verification
 * for sensitive changes like email address updates.
 * 
 * @param {Object} accountData - Account information to update
 * @param {string} [accountData.firstName] - User's first name
 * @param {string} [accountData.lastName] - User's last name
 * @param {string} [accountData.email] - User's email address (requires verification)
 * @param {string} [accountData.dateOfBirth] - User's date of birth (ISO format)
 * @returns {Promise<Object>} Updated user account data
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - Email already exists (409)
 *   - Invalid data format (400)
 *   - Network connection fails
 * 
 * @example
 * // Update user's name
 * const updatedAccount = await updateAccountInfo({
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 * console.log(updatedAccount); // { id: 1, firstName: 'John', lastName: 'Doe', ... }
 */
export const updateAccountInfo = async (accountData) => {
    try {
        const res = await api.put("/api/users/account", accountData)
        return res.data
    } catch (error) {
        console.error("Update account info error: ", error)
        throw error.response?.data || "Failed to update account information!"
    }
};


/**
 * Deletes the currently authenticated user's account
 * 
 * Permanently removes user account and all associated data including
 * listings, reviews, messages, and profile information. This action
 * is irreversible and typically requires confirmation.
 * 
 * @returns {Promise<Object>} Deletion confirmation response
 * @returns {string} returns.message - Confirmation message
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - Account deletion is disabled (403)
 *   - Network connection fails
 *   - Server returns error response
 * 
 * @example
 * // Delete user account (with confirmation from alert popup)
 * if (confirm('Are you sure you want to delete your account?')) {
 *   const result = await deleteUserAccount();
 *   console.log(result.message); // 'Account deleted successfully'
 *   // Redirect to login page
 * }
 */
export const deleteUserAccount = async () => {
    try {
        const res = await api.delete("/api/users")
        return res.data

    } catch (error) {
        console.error("Delete account error: ", error)
        throw error.response?.data || "Failed to delete account!"
    }
};

/**
 * Updates user's privacy and visibility settings
 * 
 * Controls how user's profile and information are visible to others
 * including public profile status, messaging preferences, and other
 * privacy-related settings.
 * 
 * @param {Object} privacyData - Privacy settings to update
 * @param {boolean} [privacyData.publicProfile] - Whether profile is publicly visible
 * @param {boolean} [privacyData.messagesEnabled] - Whether user can receive messages
 * @param {boolean} [privacyData.showEmail] - Whether to display email publicly
 * @param {boolean} [privacyData.showPhone] - Whether to display phone number publicly
 * @returns {Promise<Object>} Updated privacy settings
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - Invalid privacy settings (400)
 *   - Network connection fails
 * 
 * @example
 * // Make profile private and disable messages
 * const privacySettings = await updatePrivacyInfo({
 *   publicProfile: false,
 *   messagesEnabled: false
 * });
 * console.log(privacySettings); // { publicProfile: false, messagesEnabled: false }
 */
export const updatePrivacyInfo = async (privacyData) => {
    try {
        const res = await api.put("/api/users/privacy", privacyData)
        return res.data
    } catch (error) {
        console.error("Update privacy info error: ", error)
        throw error.response?.data || "Failed to update privacy settings!"
    }
};

/**
 * Updates user's profile information including bio and profile picture
 * 
 * Handles profile customization including bio text and profile photo upload.
 * Uses multipart/form-data for file uploads which allows sending both
 * text and binary data in a single request.
 * 
 * @param {Object} profileData - Profile information to update
 * @param {string} [profileData.bio] - User's bio/description text
 * @param {File} [profileData.profilePhoto] - Profile image file (JPEG, PNG, etc.)
 * @param {boolean} [profileData.resetProfilePhoto] - Set to true to remove current photo
 * @returns {Promise<Object>} Updated profile information
 * @returns {string} returns.bio - Updated bio text
 * @returns {string|null} returns.profilePhoto - URL of updated profile photo
 * @throws {Error} When:
 *   - User is not authenticated (401)
 *   - File format not supported (400)
 *   - File size exceeds limit (413)
 *   - Network connection fails
 * 
 * @example
 * // Update bio and upload profile picture
 * const formData = new FormData();
 * formData.append('bio', 'Passionate developer and designer');
 * formData.append('profilePhoto', fileInput.files[0]);
 * 
 * const updatedProfile = await updateProfileInfo(formData);
 * console.log(updatedProfile); // { bio: '...', profilePhoto: 'https://...' }
 */
export const updateProfileInfo = async (profileData) => {
    try {
        const res = await api.put("/api/users/profile", profileData, {
            headers: { 'Content-Type': undefined }  // Let browser set multipart boundary
        })
        return res.data
    } catch (error) {
        console.error("Update profile info error: ", error)
        throw error.response?.data || "Failed to update profile information!"
    }
};

/**
 * Retrieves public profile information for a specific user
 * 
 * Fetches publicly available user profile data by user ID.
 * Only returns information that the user has made public
 * (excludes private data like email, phone, etc.).
 * 
 * @param {string|number} targetUserId - The ID of the user to fetch
 * @returns {Promise<Object>} Public profile data
 * @returns {string} returns.firstName - User's first name
 * @returns {string} returns.lastName - User's last name
 * @returns {string|null} returns.bio - User's bio (if public)
 * @returns {string|null} returns.profilePhoto - Profile photo URL (if set)
 * @returns {Array} returns.roles - User's roles (BUYER, SELLER, etc.)
 * @returns {Object} returns.stats - User statistics (listings, reviews, etc.)
 * @throws {Error} When:
 *   - User ID not found (404)
 *   - User profile is private (403)
 *   - Network connection fails
 *   - Invalid user ID format (400)
 * 
 * @example
 * // Get public profile for user with ID 123
 * const userProfile = await getPublicProfile(123);
 * console.log(`${userProfile.firstName} ${userProfile.lastName}`);
 * console.log(`Bio: ${userProfile.bio}`);
 */
export const getPublicProfile = async (targetUserId) => {
    try {
        const res = await api.get(`/api/users/id?targetUserId=${targetUserId}`)
        return res.data
    } catch (error) {
        console.error("Fetch public profile failed: ", error)
        throw error.response?.data || "Failed to fetch public profile!"
    }
};

/**
 * Searches for public user profiles by name or email
 * 
 * Performs a text search across public user profiles matching
 * the search query against names, bios, and other public fields.
 * Returns paginated results for performance.
 * 
 * @param {string} searchInput - Search query string
 * @returns {Promise<Object>} Search results object
 * @returns {Array<Object>} returns.profiles - Array of matching user profiles
 * @returns {number} returns.total - Total number of matches
 * @returns {number} returns.page - Current page number
 * @returns {number} returns.totalPages - Total number of pages
 * @throws {Error} When:
 *   - Search query too short (400)
 *   - Search rate limit exceeded (429)
 *   - Network connection fails
 *   - Server error occurs (500)
 * 
 * @example
 * // Search for users named "John"
 * const searchResults = await searchPublicProfiles('John');
 * console.log(`Found ${searchResults.total} users`);
 * searchResults.profiles.forEach(user => {
 *   console.log(`${user.firstName} ${user.lastName}`);
 * });
 * 
 * NOT YET USED IN THE FRONTEND, TIME CONSTRAINTS LIMITED US TO IMPLEMENT THIS
 */
export const searchPublicProfiles = async (searchInput) => {
    try {
        const res = await api.get(`/api/users/search?searchInput=${encodeURIComponent(searchInput)}`)
        return res.data
    } catch (error) {
        console.error("Search public profiles failed: ", error)
        throw error.response?.data || "Failed to search public profiles!"
    }
};

/**
 * User API object containing all user-related functions
 * 
 * Provides a convenient way to import all user API functions
 * at once while maintaining tree-shaking compatibility.
 * 
 * @namespace userApi
 * @property {Function} userApi.getUserInfo - Get current user information
 * @property {Function} userApi.updateAccountInfo - Update account information
 * @property {Function} userApi.deleteUserAccount - Delete user account
 * @property {Function} userApi.updatePrivacyInfo - Update privacy settings
 * @property {Function} userApi.updateProfileInfo - Update profile information
 * @property {Function} userApi.getPublicProfile - Get public user profile
 * @property {Function} userApi.searchPublicProfiles - Search public profiles
 * 
 * @example
 * // Import all user API functions
 * import { userApi } from '@/api/userApi';
 * 
 * // Use individual functions
 * const userData = await userApi.getUserInfo();
 * const searchResults = await userApi.searchPublicProfiles('John');
 */
export const userApi = {
    getUserInfo,
    updateAccountInfo,
    deleteUserAccount,
    updatePrivacyInfo,
    updateProfileInfo,
    getPublicProfile,
    searchPublicProfiles
};