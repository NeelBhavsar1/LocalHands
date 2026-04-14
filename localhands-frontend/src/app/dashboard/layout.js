"use client"
import React from 'react'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import Sidebar from '@/components/Sidebar/Sidebar'
import styles from './layout.module.css'

/**
 * Layout component for the dashboard.
 * 
 * This component provides the main layout structure for the dashboard,
 * including the navigation bar, sidebar, and content area. Therfore, every
 * other page in the sidebar will get rendered onto this section with the 
 * Navigation bar and the sidebar.
 * 
 * @param {Object} param0 - The props object
 * @param {React.ReactNode} param0.children - The children to render
 * @returns {React.ReactNode} The rendered layout
 */

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
