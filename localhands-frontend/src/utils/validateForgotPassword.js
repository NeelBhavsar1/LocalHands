/**
 * Validates email for forgot password functionality
 * 
 * This function validates the email address entered by the user
 * when requesting a password reset. Supports internationalization
 * for error messages.
 * 
 * @param {string} email - The email address to validate
 * @param {function} t - Translation function for internationalization
 * @returns {Object} errors - Object containing validation error messages
 * @returns {string|undefined} errors.email - Email validation error message
 * 
 * @example
 * const errors = validateForgotPasswordEmail('user@example.com', t);
 * if (Object.keys(errors).length === 0) {
 *   // Email is valid, send reset PIN
 * } else {
 *   // Display email error to user
 * }
 */
export const validateForgotPasswordEmail = (email, t) => {
    // Initialize empty errors object
    const errors = {};
    
    // Email required validation
    if (!email.trim()) {
        errors.email = t ? t("forgotPassword.errors.emailRequired") : 'Email address is required!';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        // Email format validation using regex
        errors.email = t ? t("forgotPassword.errors.invalidEmail") : 'Enter a valid email address';
    }
    
    // Return errors object (empty if no validation errors)
    return errors;
};

/**
 * Validates PIN for forgot password functionality
 * 
 * Validates the PIN sent to user's email for password reset.
 * Ensures PIN is numeric and has correct length.
 * 
 * @param {string} pin - The PIN code to validate
 * @param {number} [PIN_LENGTH=6] - Expected length of the PIN (default: 6)
 * @param {function} t - Translation function for internationalization
 * @returns {Object} errors - Object containing validation error messages
 * @returns {string|undefined} errors.pin - PIN validation error message
 * 
 * @example
 * const errors = validateForgotPasswordPin('123456', 6, t);
 * if (Object.keys(errors).length === 0) {
 *   // PIN is valid, proceed with password reset
 * } else {
 *   // Display PIN error to user
 * }
 */
export const validateForgotPasswordPin = (pin, PIN_LENGTH = 6, t) => {
    // Initialize empty errors object
    const errors = {};

    // PIN required validation
    if (!pin.trim()) {
        errors.pin = t ? t("forgotPassword.errors.pinRequired") : 'PIN is required';
    } else if (!/^\d+$/.test(pin)) {
        // PIN numeric validation - only digits allowed
        errors.pin = t ? t("forgotPassword.errors.pinNumeric") : 'PIN must contain only numbers';
    } else if (pin.length !== PIN_LENGTH) {
        // PIN length validation - must match expected length
        errors.pin = t ? t("forgotPassword.errors.pinLength") : `PIN must be exactly ${PIN_LENGTH} digits`;
    }

    // Return errors object (empty if no validation errors)
    return errors;
};

/**
 * Validates password reset functionality
 * 
 * Validates new password and confirmation during password reset.
 * Ensures password meets minimum requirements and matches confirmation.
 * 
 * @param {string} password - The new password to validate
 * @param {string} confirmPassword - The password confirmation to validate
 * @param {function} t - Translation function for internationalization
 * @returns {Object} errors - Object containing validation error messages
 * @returns {string|undefined} errors.password - Password validation error message
 * @returns {string|undefined} errors.confirmPassword - Password confirmation error message
 * 
 * @example
 * const errors = validatePasswordReset('newPassword123', 'newPassword123', t);
 * if (Object.keys(errors).length === 0) {
 *   // Passwords are valid, proceed with password reset
 * } else {
 *   // Display password errors to user
 * }
 */
export const validatePasswordReset = (password, confirmPassword, t) => {
    // Initialize empty errors object
    const errors = {};
    
    // Password required validation
    if (!password.trim()) {
        errors.password = t ? t("forgotPassword.errors.passwordRequired") : 'Password is required';
    } else if (password.length < 8) {
        // Password minimum length validation
        errors.password = t ? t("forgotPassword.errors.passwordLength") : 'Password must be at least 8 characters';
    }
    
    // Password confirmation required validation
    if (!confirmPassword.trim()) {
        errors.confirmPassword = t ? t("forgotPassword.errors.confirmPasswordRequired") : 'Please confirm your password';
    } else if (password !== confirmPassword) {
        // Password match validation
        errors.confirmPassword = t ? t("forgotPassword.errors.passwordMismatch") : 'Passwords do not match';
    }
    
    // Return errors object (empty if no validation errors)
    return errors;
};
