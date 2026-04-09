import api from './api';

//endpoint 1 for submitting email
export const sendPasswordResetEmail = async (email) => {
    try {
        const response = await api.post("/api/auth/forgot-password", null, {
            params: { email }
        })
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
};

//endpoint 2 for verifiying passcode
export const verifyPasswordResetCode = async (email, code) => {
    try {
        const response = await api.post('/api/auth/verify-password-reset-code', { email, code })
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
};

//endpoint 3 for submitting new password
export const resetPassword = async (email, token, password) => {
    try {
        const response = await api.post('/api/auth/reset-password', { email, token, password })
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
};
