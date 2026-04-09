"use client";

import React from 'react'
import styles from './ToggleSwitch.module.css'
import { motion } from 'framer-motion'

export default function ToggleSwitch({ isOn, setIsOn }) {

    const toggleSwitch = () => {
        setIsOn(!isOn);
    }

    return (
        <div className={`${styles.switch} ${isOn ? styles.on : styles.off}`} onClick={toggleSwitch}>
        <motion.div
            className={styles.knob}
            layout
            transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
            }}
        />
        </div>
    )
}
