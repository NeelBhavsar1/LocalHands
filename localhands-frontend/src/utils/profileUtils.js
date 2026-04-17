//profile page utility functions

import { TRANSLATIONS } from './translations';

export const BACKEND_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

//create formdata for profile update
export const createProfileFormData = (bio, selectedFile, resetProfilePhoto = false) => {
    const formData = new FormData();

    const bioBlob = new Blob([JSON.stringify({ bio: bio || '', resetProfilePhoto: resetProfilePhoto })], {
        type: 'application/json'
    });
    formData.append('bio', bioBlob)

    if (selectedFile) {
        formData.append('photo', selectedFile)
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
export const createProfileSaveHandler = ({ setSaving, allowMessages, publicProfile, bio, selectedFile, resetProfilePhoto, updatePrivacyInfo, updateProfileInfo, setSelectedFile, setResetProfilePhoto, setProfileImage, defaultProfileImage }) => async () => {
    setSaving(true);
    try {
        await updatePrivacyInfo({
            messagesAllowed: !!allowMessages,
            publicProfile: !!publicProfile
        });

        const formData = createProfileFormData(bio, selectedFile, resetProfilePhoto);
        const response = await updateProfileInfo(formData);

        setSelectedFile(null);
        setResetProfilePhoto(false);

        //update profile image if server returned a new url (or null for default)
        if (response && response.profilePhotoUrl !== undefined) {
            setProfileImage(response.profilePhotoUrl ? BACKEND_URL + response.profilePhotoUrl : defaultProfileImage);
        }

        alert(TRANSLATIONS.profileUpdatedSuccessfully)
    } catch (error) {
        alert(TRANSLATIONS.failedToUpdateProfile + ': ' + error)
    } finally {
        setSaving(false)
    }
};

//check if user has seller or buyer role
export const hasListingsRole = (user) => {
    return user?.roles?.includes("SELLER")
}

//fetch user's reviews
export const fetchUserReviews = async (backendUrl) => {
    try {
        const response = await api.get("/api/reviews/me")
        return response.data
    } catch (error) {
        console.error("Failed to fetch user reviews:", error)
        throw new Error(TRANSLATIONS.validation.reviewsFetchFailed)
    }
}

//update review in user reviews state
export const updateUserReview = (setUserReviews, updatedReview) => {
    setUserReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r))
}

//remove review from user reviews state
export const removeUserReview = (setUserReviews, reviewId) => {
    setUserReviews(prev => prev.filter(r => r.id !== reviewId))
}
