//helper functions for settings page

const validateSettingsForm = (formData) => {
    const errors = {};
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
}

const createUpdateData = (formData) => {
    const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email
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

const clearPasswordFields = (setFormData) => {
    setFormData(prev => ({ ...prev, existingPassword: '', newPassword: '', confirmPassword: '' }))
}

export const handleUpdateAccount = async (formData, setErrors, setFormData, updateAccountInfo) => {
    const validationErrors = validateSettingsForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
        return;
    }

    try {
        const updateData = createUpdateData(formData)
        await updateAccountInfo(updateData)
        alert('Account information updated successfully!')
        
        clearPasswordFields(setFormData);
    } catch (error) {
        alert('Error updating account: ' + error)
    }
};

export const handleDeleteAccount = async (deleteUserAccount) => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            await deleteUserAccount()       
            alert('Account deleted successfully!')
            window.location.href = '/signup'
        } catch (error) {
            alert('Error deleting account: ' + error)
        }
    }
};
