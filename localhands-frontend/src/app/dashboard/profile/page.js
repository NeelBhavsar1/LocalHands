"use client"

import styles from './page.module.css'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch'
import { getUserInfo, updatePrivacyInfo, updateProfileInfo } from '@/api/userApi'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'

export default function page() {
    const { t } = useTranslation();
    const [allowMessages, setAllowMessages] = useState(true);
    const [publicProfile, setPublicProfile] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState('/profile.png');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch user info on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo();
                // Handle both possible field names from backend
                const messagesValue = userData.messagesEnabled;
                const publicProfileValue = userData.publicProfile;
                setAllowMessages(messagesValue === true);
                setPublicProfile(publicProfileValue === true);
                setBio(userData.bio || '');
                if (userData.pfp || userData.photo) {
                    setProfileImage(userData.pfp || userData.photo);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                alert('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleChangePicture = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updatePrivacyInfo({
                messagesAllowed: !!allowMessages,
                publicProfile: !!publicProfile
            });

            const formData = new FormData();
            
            const bioBlob = new Blob([JSON.stringify({ bio: bio || '' })], { 
                type: 'application/json' 
            });
            formData.append('bio', bioBlob);
            if (selectedFile) {
                formData.append('photo', selectedFile);
            }
            await updateProfileInfo(formData);

            setSelectedFile(null);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile: ' + error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.profileContainer}>
                <h1 className={styles.profileTitle}>{t("profile.title")}</h1>

                <div className={styles.contentWrapper}>
                    <div className={styles.leftSection}>
                        <div className={styles.profileImageContainer}>
                            <Image src={profileImage} alt="Profile" width={120} height={120} className={styles.profileImage} />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <button type="button" className={styles.changePictureBtn} onClick={handleChangePicture}>
                                {t("profile.changeProfilePicture")}
                            </button>
                        </div>

                        <div className={styles.bioContainer}>
                            <label htmlFor="bio">{t("profile.bio")}</label>
                            <textarea 
                                id="bio" 
                                placeholder={t("profile.bioPlaceholder")} 
                                className={styles.bioTextarea}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
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
                </div>

                <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
                    {saving ? <LoadingSpinner /> : t("profile.save")}
                </button>
            </div>
        </div>
    )
}