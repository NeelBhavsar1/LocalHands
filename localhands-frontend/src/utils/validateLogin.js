import { TRANSLATIONS } from './translations';

/**
 * Validates login form data before submission
 * 
 * This utility function performs client-side validation of login form inputs
 * to ensure data integrity and provide immediate user feedback.
 * 
 * @param {Object} formData - The form data object containing email and password
 * @param {string} formData.email - User's email address
 * @param {string} formData.password - User's password
 * @returns {Object} errors - Object containing validation error messages
 * @returns {string|undefined} errors.email - Email validation error message
 * @returns {string|undefined} errors.password - Password validation error message
 * 
 * @example
 * const formData = { email: 'test@example.com', password: 'password123' };
 * const errors = validateLoginForm(formData);
 * if (Object.keys(errors).length === 0) {
 *   // Form is valid, proceed with submission
 * } else {
 *   // Display errors to user
 * }
 */
export const validateLoginForm = (formData, t) => {
    // Initialize empty errors object
    const errors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = t ? t('validation.email.required') : 'Email is required!';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t ? t('validation.email.invalid') : 'Enter a valid email!';
    }

    // Password validation
    if (!formData.password) {
      errors.password = t ? t('validation.password.required') : 'Password is required!';
    } else if (formData.password.length < 8) {
      errors.password = t ? t('validation.password.minLength') : 'Password must be at least 8 characters';
    }

    // Return errors object (empty if no validation errors)
    return errors;
}