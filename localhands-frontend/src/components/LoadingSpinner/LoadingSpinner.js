"use client"

import React from 'react'
import styles from './LoadingSpinner.module.css'
import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.ring}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
    </div>
  )
}
