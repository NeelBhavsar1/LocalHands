"use client"
import React, { useState } from 'react'
import styles from './page.module.css'
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch'


export default function page() {

    const [isEnabled, setIsEnabled] = useState(false);
    const [isProfilePublic, setIsProfilePublic] = useState(true);
    const [allowMessages, setAllowMessages] = useState(true);

  return (
    <div className={styles.container}>
        <div className={styles.header}>Settings</div>
        <div className={styles.settingsListContainer}>

            <div className={styles.section}>
                <p className={styles.sectionHeader}>Account</p>

                <div className={styles.settingItem}>
                    <span>Email</span>
                    <button className={styles.actionBtn}>Change</button>
                </div>

                <div className={styles.settingItem}>
                    <span>Password</span>
                    <button className={styles.actionBtn}>Update</button>
                </div>

                <div className={styles.settingItem}>
                    <span>Delete Account</span>
                    <button className={styles.dangerBtn}>Delete</button>
                </div>
            </div>

            <div className={styles.section}>
                <p className={styles.sectionHeader}>Privacy & Security</p>

                <div className={styles.settingItem}>
                    <span>Public Profile</span>
                    <ToggleSwitch isOn={isProfilePublic} setIsOn={setIsProfilePublic} />
                </div>

                <div className={styles.settingItem}>
                    <span>Allow Messages</span>
                    <ToggleSwitch isOn={allowMessages} setIsOn={setAllowMessages} />
                </div>
            </div>
            
        </div>
    </div>
  )
}
