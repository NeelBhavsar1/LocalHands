"use client"
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './page.module.css'
import { getUserInfo, updateAccountInfo, deleteUserAccount } from '@/api/userApi'
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { handleUpdateAccount, handleDeleteAccount, createChangeHandler, createLoadUserData } from '@/utils/settingsUtils'
import { useRouter } from 'next/navigation'


export default function page() {
    const { t } = useTranslation();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        existingPassword: '',
        newPassword: '',
        confirmPassword: '',
        isServiceProvider: false
    })

    const [errors, setErrors] = useState({})

    const handleChange = createChangeHandler(setFormData)

    useEffect(() => {
        const loadUserData = createLoadUserData(setUser, setFormData, setLoading, getUserInfo, router)
        loadUserData()
    }, [])


    const onSubmit = (e) => {
        e.preventDefault()
        handleUpdateAccount(formData, setErrors, setFormData, updateAccountInfo)
    };

    const onDelete = () => {
        handleDeleteAccount(deleteUserAccount)
    };

    if (loading) {
        return <LoadingSpinner />;
    }
    
    
    if (!user) { return null; }

    return (
        <div className={styles.container}>
            <div className={styles.settingsContainer}>
                <h1 className={styles.title}>{t("settings.title")}</h1>

                <form onSubmit={onSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t("settings.accountInfo")}</h2>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">{t("settings.firstName")}</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="lastName">{t("settings.lastName")}</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="dateOfBirth">{t("settings.dateOfBirth")}</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">{t("settings.email")}</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>{t("settings.serviceProvider")}</label>
                            <div className={styles.toggleRow}>
                                <ToggleSwitch isOn={formData.isServiceProvider} setIsOn={(value) => setFormData(prev => ({ ...prev, isServiceProvider: value }))} />
                                <span className={styles.hint}>Removing this will delete all your listings and services</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t("settings.changePassword")}</h2>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="existingPassword">{t("settings.existingPassword")}</label>
                            <input type="password" id="existingPassword" name="existingPassword" value={formData.existingPassword} onChange={handleChange} className={styles.input} placeholder={t("settings.enterExistingPassword")} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">{t("settings.newPassword")}</label>
                            <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} className={styles.input} placeholder={t("settings.enterNewPassword")} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">{t("settings.confirmPassword")}</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={styles.input} placeholder={t("settings.confirmNewPassword")} />
                            {errors.confirmPassword && (
                                <span className={styles.error}>{errors.confirmPassword}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.saveButton}>
                            {t("settings.saveAccount")}
                        </button>
                    </div>
                </form>

                <div className={styles.dangerSection}>
                    <h2 className={styles.sectionTitle}>{t("settings.dangerZone")}</h2>
                    <p className={styles.dangerText}>
                        {t("settings.deleteWarning")}
                    </p>
                    <button onClick={onDelete} className={styles.deleteButton}>
                        {t("settings.deleteAccount")}
                    </button>
                </div>
            </div>
        </div>
    )
}
