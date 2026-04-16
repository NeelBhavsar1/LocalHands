"use client"

import styles from './page.module.css'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch'
import { getUserInfo, updatePrivacyInfo, updateProfileInfo } from '@/api/userApi'
import { getMyListings } from '@/api/listingApi'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import ListingList from '@/components/ListingList/ListingList'
import { BACKEND_URL, createFileChangeHandler, triggerFileInput, generateProfileAltText, createProfileSaveHandler, hasListingsRole, fetchUserReviews, updateUserReview, removeUserReview } from '@/utils/profileUtils'
import ReviewsSection from '@/components/ReviewsSection/ReviewsSection'

export default function page() {
    const { t } = useTranslation();
    const router = useRouter();
    const [allowMessages, setAllowMessages] = useState(true);
    const [publicProfile, setPublicProfile] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState('/profile.png');
    const [profileAltText, setProfileAltText] = useState('Profile');
    const [selectedFile, setSelectedFile] = useState(null);
    const [resetProfilePhoto, setResetProfilePhoto] = useState(false);
    const [listings, setListings] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [user, setUser] = useState(null);
    const fileInputRef = useRef(null);
    const DEFAULT_PROFILE_IMAGE = '/profile.png';

    // Fetch user info and listings on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo();
                setUser(userData);
                
                const messagesValue = userData.messagesEnabled;
                const publicProfileValue = userData.publicProfile;
                setAllowMessages(messagesValue === true);
                setPublicProfile(publicProfileValue === true);
                setBio(userData.bio || '');
                const url = userData.profilePhoto?.url;
                if (url && url.trim() !== "") {
                    setProfileImage(BACKEND_URL + url);
                }
                setProfileAltText(generateProfileAltText(userData));
                setResetProfilePhoto(false);

                //to fetch listings if user is a seller or buyer (since buyer listings will not appear on dashboard page)
                if (hasListingsRole(userData)) {
                    const listingsData = await getMyListings();
                    setListings(listingsData);
                }

                //fetch user's reviews
                const reviewsData = await fetchUserReviews(BACKEND_URL);
                setUserReviews(reviewsData);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                router.push('/login');
                return;
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleFileChange = (e) => {
        createFileChangeHandler(setSelectedFile, setProfileImage)(e);
        setResetProfilePhoto(false);
    };

    const handleChangePicture = triggerFileInput(fileInputRef);

    const handleResetPicture = () => {
        setSelectedFile(null);
        setResetProfilePhoto(true);
        setProfileImage(DEFAULT_PROFILE_IMAGE);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSave = createProfileSaveHandler({
        setSaving,
        allowMessages,
        publicProfile,
        bio,
        selectedFile,
        resetProfilePhoto,
        updatePrivacyInfo,
        updateProfileInfo,
        setSelectedFile,
        setResetProfilePhoto,
        setProfileImage,
        defaultProfileImage: DEFAULT_PROFILE_IMAGE
    });

    if (loading) {
        return (
            <div className={styles.container}>
                <LoadingSpinner />
            </div>
        );
    }
    
    
    if (!user) { return null; }

    return (
        <div className={styles.container}>
            <div className={styles.profileContainer}>
                <h1 className={styles.profileTitle}>{t("profile.title")}</h1>

                <div className={styles.contentWrapper}>
                    <div className={styles.leftSection}>
                        <div className={styles.profileImageContainer}>
                            <img src={profileImage} alt={profileAltText} width={120} height={120} className={styles.profileImage} />
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                            <div className={styles.profileImageButtons}>

                                <button type="button" className={styles.changePictureBtn} onClick={handleChangePicture}>
                                    {t("profile.changeProfilePicture")}
                                </button>

                                <button type="button" className={styles.resetPictureBtn} onClick={handleResetPicture}>
                                    {t("profile.resetProfilePicture")}
                                </button>
                                
                            </div>
                        </div>

                        <div className={styles.bioContainer}>
                            <label htmlFor="bio">{t("profile.bio")}</label>
                            <textarea id="bio" placeholder={t("profile.bioPlaceholder")} className={styles.bioTextarea} value={bio} onChange={(e) => setBio(e.target.value)} />
                            
                            <button className={styles.saveBioButton} onClick={handleSave} disabled={saving}>
                                {saving ? <LoadingSpinner /> : t("profile.saveBioPfp")}
                            </button>
                        </div>
                    </div>

                    <div className={styles.rightSection}>
                        <div className={styles.formContainer}>
                            <h2 className={styles.editai}>{t("profile.privacySettings")}</h2>
                            
                            <div className={styles.checkboxGroup}>
                                <label>{t("profile.publicProfile")}</label>
                                <ToggleSwitch isOn={publicProfile} setIsOn={async (value) => {
                                    setPublicProfile(value);
                                    try {
                                        await updatePrivacyInfo({
                                            messagesAllowed: !!allowMessages,
                                            publicProfile: !!value
                                        })
                                    } catch (error) {
                                        console.error('Failed to update public profile setting:', error);
                                    }
                                }} 
                                />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label>{t("profile.allowMessages")}</label>
                                <ToggleSwitch isOn={allowMessages} setIsOn={async (value) => {
                                    setAllowMessages(value);
                                    try {
                                        await updatePrivacyInfo({
                                            messagesAllowed: !!value,
                                            publicProfile: !!publicProfile
                                        })  
                                    } catch (error) {
                                        console.error('Failed to update messages setting:', error);
                                    }
                                }} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.bottomRow}>
                        {hasListingsRole(user) && (
                            <div className={styles.listingsSection}>
                                <h2 className={styles.sectionTitle}>{t("profile.yourListings")}</h2>
                                <ListingList listings={listings} />
                            </div>
                        )}
                        <div className={styles.reviewsSection}>
                            <h2 className={styles.sectionTitle}>{t("profile.yourReviews")}</h2>
                            <ReviewsSection reviews={userReviews} backendUrl={BACKEND_URL} t={t} currentUser={user} onReviewUpdated={(updatedReview) => updateUserReview(setUserReviews, updatedReview)} onReviewDeleted={(reviewId) => removeUserReview(setUserReviews, reviewId)} showViewListing={true} onViewListing={(listingId) => router.push(`/dashboard/listings/${listingId}`)} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}