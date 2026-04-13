/**
 * Validates signup form data before user registration
 * 
 * This utility function performs comprehensive client-side validation
 * of signup form inputs to ensure data integrity and provide immediate
 * user feedback during the registration process.
 * 
 * @param {Object} formData - The complete form data object to validate
 * @param {string} formData.firstName - User's first name
 * @param {string} formData.lastName - User's last name
 * @param {string} formData.email - User's email address
 * @param {string} formData.dateOfBirth - User's date of birth
 * @param {string} formData.password - User's password
 * @param {string} formData.confirmPassword - Password confirmation
 * @param {boolean} formData.isServiceProvider - Whether user is a service provider
 * @param {boolean} formData.isConsumer - Whether user is a consumer
 * @returns {Object} errors - Object containing validation error messages
 * @returns {string|undefined} errors.firstName - First name validation error
 * @returns {string|undefined} errors.lastName - Last name validation error
 * @returns {string|undefined} errors.email - Email validation error
 * @returns {string|undefined} errors.dateOfBirth - Date of birth validation error
 * @returns {string|undefined} errors.password - Password validation error
 * @returns {string|undefined} errors.confirmPassword - Password confirmation error
 * @returns {string|undefined} errors.isServiceProvider - Account type selection error
 * 
 * @example
 * const formData = {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   dateOfBirth: '1990-01-01',
 *   password: 'password123',
 *   confirmPassword: 'password123',
 *   isServiceProvider: true,
 *   isConsumer: false
 * };
 * const errors = validateSignupForm(formData);
 * if (Object.keys(errors).length === 0) {
 *   // Form is valid, proceed with registration
 * } else {
 *   // Display errors to user
 * }
 */
export const validateSignupForm = (formData) => {
    // Initialize empty errors object
    const errors = {};

    // First name validation - required field
    if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required!';
    }

    // Last name validation - required field
    if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required!';
    }

    // Email validation - required and format check
    if (!formData.email.trim()) {
        errors.email = 'Email address is required!';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Enter a valid email address';
    }

    // Date of birth validation - required field
    if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
    }

    // Password validation - required and minimum length
    if (!formData.password) {
        errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }

    // Password confirmation validation - required and match check
    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    // Account type validation - at least one type must be selected
    if (!formData.isServiceProvider && !formData.isConsumer) {
        errors.isServiceProvider = 'Please select at least one account type';
    }

    // Return errors object (empty if no validation errors)
    return errors;
};