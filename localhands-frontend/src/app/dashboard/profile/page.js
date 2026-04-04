"use client"

import styles from './page.module.css'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch'

export default function page() {
    const { t } = useTranslation();
    const [isServiceProvider, setIsServiceProvider] = useState(false);
    const [allowMessages, setAllowMessages] = useState(true);
    const [publicProfile, setPublicProfile] = useState(true);

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
                            <textarea id="bio" placeholder={t("profile.bioPlaceholder")} className={styles.bioTextarea} />
                        </div>
                    </div>

                    <div className={styles.rightSection}>
                        <div className={styles.formContainer}>
                            <h2 className={styles.editai}>{t("profile.editAccountInfo")}</h2>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">{t("profile.firstName")}</label>
                                <input type="text" id="firstName" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">{t("profile.lastName")}</label>
                                <input type="text" id="lastName" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="dateOfBirth">{t("profile.dateOfBirth")}</label>
                                <input type="date" id="dateOfBirth" className={styles.input} />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label>{t("profile.serviceProvider")}</label>
                                <ToggleSwitch isOn={isServiceProvider} setIsOn={setIsServiceProvider} />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label>{t("profile.allowMessages")}</label>
                                <ToggleSwitch isOn={allowMessages} setIsOn={setAllowMessages} />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label>{t("profile.publicProfile")}</label>
                                <ToggleSwitch isOn={publicProfile} setIsOn={setPublicProfile} />
                            </div>
                        </div>
                    </div>
                </div>

                <button className={styles.saveButton}>{t("profile.save")}</button>
            </div>
        </div>
    )
}