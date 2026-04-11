//profile page utility functions

export const BACKEND_URL ='http://localhost:8080';

//create formdata for profile update
export const createProfileFormData = (bio, selectedFile) => {
    const formData = new FormData();

    const bioBlob = new Blob([JSON.stringify({ bio: bio || '' })], {
        type: 'application/json'
    });
    formData.append('bio', bioBlob);

    if (selectedFile) {
        formData.append('photo', selectedFile);
    }

    return formData;
};

//create file change handler
export const createFileChangeHandler = (setSelectedFile, setProfileImage) => (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (e) => setProfileImage(e.target.result);
        reader.readAsDataURL(file);
    }
};

//trigger file input click
export const triggerFileInput = (fileInputRef) => () => {
    fileInputRef.current?.click();
};

//generate profile image alt text
export const generateProfileAltText = (userData) => {
    const alt = userData.profilePhoto?.altText;
    if (alt && alt.trim() !== "") {
        return alt;
    } else if (userData.firstName && userData.firstName.trim() !== "") {
        return `No image of ${userData.firstName}.`;
    }
    return 'Profile';
};

//create privacy toggle handler
export const createPrivacyToggleHandler = (setState, updatePrivacyInfo, otherValue) => async (value) => {
    setState(value);
    try {
        await updatePrivacyInfo({
            messagesAllowed: !!otherValue.messages,
            publicProfile: !!otherValue.profile
        });
    } catch (error) {
        console.error('Failed to update privacy setting:', error)   
    }
};

//create profile save handler
export const createProfileSaveHandler = ({
    setSaving,
    allowMessages,
    publicProfile,
    bio,
    selectedFile,
    updatePrivacyInfo,
    updateProfileInfo,
    setSelectedFile
}) => async () => {
    setSaving(true);
    try {
        await updatePrivacyInfo({
            messagesAllowed: !!allowMessages,
            publicProfile: !!publicProfile
        });

        const formData = createProfileFormData(bio, selectedFile);
        await updateProfileInfo(formData);

        setSelectedFile(null);
        alert('Profile updated successfully!')
    } catch (error) {
        alert('Failed to update profile: ' + error)
    } finally {
        setSaving(false)
    }
};

//check if user has seller or buyer role
export const hasListingsRole = (user) => {
    return user?.roles?.includes("SELLER") || user?.roles?.includes("BUYER")
}

//fetch user's reviews
export const fetchUserReviews = async (backendUrl) => {
    const response = await fetch(`${backendUrl}/api/reviews/me`, {
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('Failed to fetch reviews')
    }
    return await response.json()
}

//update review in user reviews state
export const updateUserReview = (setUserReviews, updatedReview) => {
    setUserReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r))
}

//remove review from user reviews state
export const removeUserReview = (setUserReviews, reviewId) => {
    setUserReviews(prev => prev.filter(r => r.id !== reviewId))
}
