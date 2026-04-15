import api from "./api";

/**
 * Registers a new user by submitting their registration data to the backend.
 * 
 * This function handles the user registration process by sending form data to the
 * /api/auth/register endpoint. It uses the pre configured axios instance which
 * includes the necessary headers and withCredentials setting for cookie-based
 * authentication.
 * 
 * The function expects user registration data including personal information,
 * credentials, and account type preferences. The confirmPassword field should
 * be validated on the frontend before calling this function as it's not sent
 * to the backend.
 * 
 * @async
 * @function registerUser
 * @param {Object} userData - The user registration data to submit
 * @param {string} userData.firstName - User's first name (required)
 * @param {string} userData.lastName - User's last name (required)
 * @param {string} userData.email - User's email address (required, must be valid format)
 * @param {string} userData.password - User's password (required, min 8 characters)
 * @param {string|null} userData.dateOfBirth - User's date of birth (iso date string or null)
 * @param {boolean} userData.isServiceProvider - Whether user wants to be a service provider or not
 * @param {boolean} userData.isConsumer - Whether user wants to be a consumer or not
 * @param {boolean} userData.rememberMe - Whether to remember user session or not
 * 
 * @returns {Promise<Object>} Promise that resolves to the response data from the server
 * @returns {Object} returns.data - Server response object containing registration result
 * @returns {string} returns.data.message - Success message from the server
 * @returns {string} [returns.data.userId] - Newly created user ID (if provided by backend)
 * 
 * @throws {Object} Error object with details about what went wrong
 * @throws {string} error.message - Backend error message (if available)
 * @throws {string} error.default - Fallback error message "Something went wrong during registration!"
 * 
 * @example
 * // Successful registration
 * try {
 *   const userData = {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john@example.com',
 *     password: 'securePassword123',
 *     dateOfBirth: '1990-01-01',
 *     isServiceProvider: true,
 *     isConsumer: false,
 *     rememberMe: true
 *   };
 *   const result = await registerUser(userData);
 *   console.log('Registration successful:', result.message);
 * } catch (error) {
 *   console.error('Registration failed:', error.message);
 * }
 * 
 * HTTP 200 OK status
 * HTTP 400 Bad Request status
 * HTTP 409 Conflict status
 * 
 */
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;

    } catch (error) {
        throw error.response?.data || "Something went wrong during registration!";
    }
    
};