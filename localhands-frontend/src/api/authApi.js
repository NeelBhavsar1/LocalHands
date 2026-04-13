/**
 * Authentication API functions
 * 
 * This module provides authentication-related API calls including login, logout,
 * and email confirmation functionality. Uses axios with automatic
 * token refresh and error handling.
 * 
 * @author LocalHands Frontend Team
 * @version 1.0.0
 * @since 2026-04-13
 */

import api from "./api";

/**
 * Authenticates user with email and password
 * 
 * Sends user credentials to backend authentication endpoint.
 * Handles both successful authentication and error scenarios.
 * 
 * @param {Object} userData - User credentials object
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {boolean} userData.rememberMe - Whether to remember user session
 * @returns {Promise<Object>} Authentication response with user data and tokens
 * @throws {Error} Authentication error with message
 * 
 * @example
 * const credentials = { email: 'user@example.com', password: 'password123', rememberMe: true };
 * const user = await loginUser(credentials);
 * console.log(user); // { user: {...}, token: 'jwt-token-here' }
 */
export const loginUser = async (userData) => {
    try {
        const res = await api.post("/api/auth/login", userData);
        return res.data;
        
    } catch (error) {
        console.error("Login error: ", error);
        // Return backend error message or fallback error
        throw error.response?.data || "Login failed!";
    }
};

/**
 * Logs out current user and invalidates session
 * 
 * Calls backend logout endpoint to invalidate user session
 * and clear authentication tokens. Handles logout errors gracefully.
 * 
 * @returns {Promise<Object>} Logout confirmation response
 * @throws {Error} Logout error with message
 * 
 * @example
 * try {
 *   const result = await logoutUser();
 *   console.log(result); // { message: 'Logged out successfully' }
 *   // Redirect to login page
 * } catch (error) {
 *   console.error('Logout failed:', error);
 * }
 */
export const logoutUser = async () => {
    try {
        const res = await api.post("/api/auth/logout");
        return res.data;

    } catch (error) {
        console.error("Logout error: ", error);
        // Return backend error message or fallback error
        throw error.response?.data || "Logout failed! (bruh)";
    }
};

/**
 * Activates user account using email token
 * 
 * Validates email token and activates user account.
 * Typically used after user registration when email confirmation
 * is required.
 * 
 * @param {string} token - Email confirmation token
 * @returns {Promise<Object>} Activation response with user data
 * @throws {Error} Activation error with message
 * 
 * @example
 * const result = await activateAccount('abc123-token');
 * console.log(result); // { message: 'Account activated successfully' }
 */
export const activateAccount = async (token) => {
    try {
        const res = await api.get("/api/auth/activate-account", { params: { token } });
        return res.data;
    } catch (error) {
        console.error("Activate account error: ", error);
        throw error.response?.data || "Account activation failed!";
    }
};

/**
 * Deactivates or deletes user account using email token
 * 
 * Invalidates user session and removes account data.
 * Used for account deletion or temporary deactivation.
 * 
 * @param {string} token - Email confirmation token
 * @returns {Promise<Object>} Deactivation confirmation response
 * @throws {Error} Deactivation error with message
 * 
 * @example
 * const result = await deactivateAccount('abc123-token');
 * console.log(result); // { message: 'Account deactivated successfully' }
 */
export const deactivateAccount = async (token) => {
    try {
        const res = await api.get("/api/auth/deactivate-account", { params: { token } });
        return res.data;
    } catch (error) {
        console.error("Deactivate account error: ", error);
        throw error.response?.data || "Account deactivation failed!";
    }
};

/**
 * Confirms user email address using token
 * 
 * Validates email ownership and marks email as confirmed.
 * Typically used when user needs to verify email address
 * for account security or communication preferences.
 * 
 * @param {string} token - Email confirmation token
 * @returns {Promise<Object>} Email confirmation response
 * @throws {Error} Confirmation error with message
 * 
 * @example
 * const result = await confirmEmail('abc123-token');
 * console.log(result); // { message: 'Email confirmed successfully' }
 */
export const confirmEmail = async (token) => {
    try {
        const res = await api.get("/api/auth/confirm-email", { params: { token } });
        return res.data;
    } catch (error) {
        console.error("Confirm email error: ", error);
        throw error.response?.data || "Email confirmation failed!";
    }
};
