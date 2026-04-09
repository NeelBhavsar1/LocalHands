"use client"

import styles from './page.module.css'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
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
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                alert('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update privacy settings
            await updatePrivacyInfo({
                messagesAllowed: !!allowMessages,
                publicProfile: !!publicProfile
            });

            // Update profile (bio)
            await updateProfileInfo({
                bio: bio || ''
            });

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
                            <Image src="/profile.png" alt="Profile" width={120} height={120} className={styles.profileImage}   />
                            <button className={styles.changePictureBtn}>{t("profile.changeProfilePicture")}</button>
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