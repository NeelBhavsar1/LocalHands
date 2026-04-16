
import { TRANSLATIONS } from './translations';

/**
 * Creates a change handler for form inputs
 * @param {Function} setFormData - The setter function for form data
 * @returns {Function} - A change handler function
 */
export const createChangeHandler = (setFormData) => (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
}

/**
 * Creates a function to load user data
 * @param {*} setUser - The setter function for user data
 * @param {*} setFormData - The setter function for form data
 * @param {*} setLoading - The setter function for loading state
 * @param {*} getUserInfo - The function to get user info
 * @param {*} router - The router instance for navigation
 * @returns 
 */
export const createLoadUserData = (setUser, setFormData, setLoading, getUserInfo, router) => async () => {
    try {
        const userData = await getUserInfo()
        setUser(userData)
        
        setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            dateOfBirth: userData.dateOfBirth || '',
            email: userData.email || '',
            existingPassword: '',
            newPassword: '',
            confirmPassword: '',
            isServiceProvider: userData.roles?.includes('SELLER') || false
        })
    } catch (error) {
        console.error('Failed to load user data:', error)
        router.push('/login')
        return
    } finally {
        setLoading(false)
    }
};

/**
 * Validates the settings form
 * @param {*} formData 
 * @returns 
 */
const validateSettingsForm = (formData) => {
    const errors = {};
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = TRANSLATIONS.validation.confirmPasswordMismatch;
    }
    
    return errors;
}

/**
 * Creates update data for account update
 * @param {*} formData 
 * @returns 
 */
const createUpdateData = (formData) => {
    const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        isServiceProvider: formData.isServiceProvider
    };
    
    //this is to only include password fields if they are changing
    if (formData.existingPassword) {
        updateData.existingPassword = formData.existingPassword;
    }
    
    if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
    }
    
    return updateData;
};

/**
 * Clears password fields
 * @param {*} setFormData 
 */
const clearPasswordFields = (setFormData) => {
    setFormData(prev => ({ ...prev, existingPassword: '', newPassword: '', confirmPassword: '' }))
}

/**
 * Handles account update
 * @param {*} formData 
 * @param {*} setErrors 
 * @param {*} setFormData 
 * @param {*} updateAccountInfo 
 */
export const handleUpdateAccount = async (formData, setErrors, setFormData, updateAccountInfo) => {
    const validationErrors = validateSettingsForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
        return;
    }

    try {
        const updateData = createUpdateData(formData)
        await updateAccountInfo(updateData)
        alert(TRANSLATIONS.accountUpdated)
        
        clearPasswordFields(setFormData);
    } catch (error) {
        alert(TRANSLATIONS.errorUpdatingAccount + error)
    }
};

/**
 * Handles account deletion
 * @param {*} deleteUserAccount 
 */
export const handleDeleteAccount = async (deleteUserAccount) => {
    if (window.confirm(TRANSLATIONS.accountDeleteConfirm)) {
        try {
            await deleteUserAccount()       
            alert(TRANSLATIONS.accountDeletedSuccessfully)
            window.location.href = '/signup'
        } catch (error) {
            alert(TRANSLATIONS.errorDeletingAccount + error)
        }
    }
};
