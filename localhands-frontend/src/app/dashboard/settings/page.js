"use client"
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './page.module.css'
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch'


export default function page() {
    const { t } = useTranslation();

    const [isEnabled, setIsEnabled] = useState(false);
    const [isProfilePublic, setIsProfilePublic] = useState(true);
    const [allowMessages, setAllowMessages] = useState(true);

  return (
    <div className={styles.container}>
        <div className={styles.header}>{t("settings.title")}</div>
        <div className={styles.settingsListContainer}>

            <div className={styles.section}>
                <p className={styles.sectionHeader}>{t("settings.accountSection")}</p>

                <div className={styles.settingItem}>
                    <span>{t("settings.email")}</span>
                    <button className={styles.actionBtn}>{t("settings.change")}</button>
                </div>

                <div className={styles.settingItem}>
                    <span>{t("settings.password")}</span>
                    <button className={styles.actionBtn}>{t("settings.update")}</button>
                </div>

                <div className={styles.settingItem}>
                    <span>{t("settings.deleteAccount")}</span>
                    <button className={styles.dangerBtn}>{t("settings.delete")}</button>
                </div>
            </div>

            <div className={styles.section}>
                <p className={styles.sectionHeader}>{t("settings.privacySection")}</p>

                <div className={styles.settingItem}>
                    <span>{t("settings.publicProfile")}</span>
                    <ToggleSwitch isOn={isProfilePublic} setIsOn={setIsProfilePublic} />
                </div>

                <div className={styles.settingItem}>
                    <span>{t("settings.allowMessages")}</span>
                    <ToggleSwitch isOn={allowMessages} setIsOn={setAllowMessages} />
                </div>
            </div>
            
        </div>
    </div>
  )
}
