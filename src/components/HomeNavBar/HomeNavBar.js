"use client";
import ToggleButton from "../ToggleButton/ToggleButton";
import styles from "./HomeNavBar.module.css";
import Image from "next/image";
import { useState } from "react";

export default function HomeNavBar() {
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        console.log("Mobile menu toggled:", !isMobileMenuOpen);
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Image src="/logo.png" alt="LocalHands Logo" width={100} height={100} className={styles.localHandsImage}/>
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

            <div className={styles.mobileMenuButton}>
                <button onClick={toggleMobileMenu}>
                    <Image src="/hamburger.png" alt="Mobile Menu Icon" width={30} height={30} className={styles.hamburgerIcon} />
                </button>


            </div>

            {isMobileMenuOpen &&
                <div className={styles.mobileMenu}>
                    <a href="#home" onClick={toggleMobileMenu}>Home</a>
                    <a href="#services" onClick={toggleMobileMenu}>Services</a>
                    <a href="#about" onClick={toggleMobileMenu}>About Us</a>

                    <div className={styles.actionButton}>
                        <button className={styles.loginButton}>Login</button>
                        <button>Sign Up</button>
                    </div>
                </div>
            }

        </div>
    );
}