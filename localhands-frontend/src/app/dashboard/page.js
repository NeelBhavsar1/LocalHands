"use client";

import React from 'react'
import styles from './page.module.css'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function page() {
  return (
    <div className={styles.container}>
        <HomeNavBar showLinks={false}/>
        <Sidebar />
    </div>
  )
}
