"use client";
import ToggleButton from "../ToggleButton/ToggleButton";
import styles from "./HomeNavBar.module.css";
import Image from "next/image";

export default function HomeNavBar() {
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Image src="/logo.png" alt="LocalHands Logo" width={100} height={100} />
            </div>

            <div className={styles.navLinks}>
                <a href="#home">Home</a>
                <a href="#services">Services</a>
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
            </div>

            <div className={styles.userActions}>
                <ToggleButton />
                <button className={styles.loginButton}>Login</button>
            </div>

        </div>
    );
}