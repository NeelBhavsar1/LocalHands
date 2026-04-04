//frontend validation utility for forgot password functionality

export const validateForgotPasswordEmail = (email, t) => {
    const errors = {}
    
    if (!email.trim()) {
        errors.email = t ? t("forgotPassword.errors.emailRequired") : 'Email address is required!'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = t ? t("forgotPassword.errors.invalidEmail") : 'Enter a valid email address'
    }
    
    return errors
};

export const validateForgotPasswordPin = (pin, PIN_LENGTH = 6, t) => {
    const errors = {}
    
    if (!pin.trim()) {
        errors.pin = t ? t("forgotPassword.errors.pinRequired") : 'PIN is required'
    } else if (!new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin)) {
        errors.pin = t ? t("forgotPassword.errors.pinLength") : `PIN must be exactly ${PIN_LENGTH} digits`
    }
    
    return errors
};

export const validatePasswordReset = (password, confirmPassword, t) => {
    const errors = {}
    
    if (!password.trim()) {
        errors.password = t ? t("forgotPassword.errors.passwordRequired") : 'Password is required'
    } else if (password.length < 8) {
        errors.password = t ? t("forgotPassword.errors.passwordLength") : 'Password must be at least 8 characters'
    }
    
    if (!confirmPassword.trim()) {
        errors.confirmPassword = t ? t("forgotPassword.errors.confirmPasswordRequired") : 'Please confirm your password'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = t ? t("forgotPassword.errors.passwordMismatch") : 'Passwords do not match'
    }
    
    return errors
};
