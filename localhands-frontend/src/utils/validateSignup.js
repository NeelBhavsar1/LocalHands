//frontend validation only, helper file to reduce code on signup page

export const validateSignupForm = (formData) => {
    const errors = {};

  
    if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required!';
    }

  
    if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required!';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email address is required!';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Enter a valid email address';
    }


    if (!formData.password) {
        errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }


    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }


    if (!formData.accountType) {
        errors.accountType = 'Please select an account type';
    }

    return errors;
};