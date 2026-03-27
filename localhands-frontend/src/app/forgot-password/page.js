"use client"

import React from 'react'
import styles from './page.module.css'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'



export default function page() {
  return (
    <div className={styles.container}>
        <HomeNavBar showLinks={false}/>
        <div className={styles.content}>
            <div className={styles.header}>
                <h2>Forgotten password?</h2>
                <p>Please follow the instructions below</p>
            </div>
        </div>
        <LoadingSpinner />

    </div>
  )
}
