"use client"
import React from 'react'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import Sidebar from '@/components/Sidebar/Sidebar'
import styles from './layout.module.css'

//do no t modify layout.module.css

export default function layout({children}) {
  return (
    <div className={styles.container}>
        <HomeNavBar showLinks={false}/>
        <Sidebar />
        <main className={styles.content}>
            {children}
        </main>
    </div>
  )
}
