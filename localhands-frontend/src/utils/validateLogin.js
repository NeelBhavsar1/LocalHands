/**
 * Validates login form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object containing validation errors
 */
export const validateLoginForm = (formData) => {

    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required!"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email!";
    }

    if (!formData.password) {
      errors.password = "Password is required!"
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    return errors;

  }