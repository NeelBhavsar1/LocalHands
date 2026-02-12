"use client";
import ToggleButton from "../ToggleButton/ToggleButton";
import styles from "./HomeNavBar.module.css";
import Image from "next/image";
import { useState } from "react";


/*
Features to implement:
1) Language selection dropdown using next-i18next
2) Fix mobile hamburger menu dropdown
3) Update the CSS for the mobile menu to ensure it displays correctly on all screen sizes
4) Provide global CSS for the toggle buttons!
*/

export default function HomeNavBar() {
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        console.log("Mobile menu toggled:", !isMobileMenuOpen);
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Image src="/logo-v2.png" alt="LocalHands Logo" width={100} height={100} className={styles.localHandsImage}/>
                <p>Local<span>Hands</span></p>
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
                    <a href="#contact" onClick={toggleMobileMenu}>Contact</a>


                    <div className={styles.actionButton}>
                        <ToggleButton />
                        <button className={styles.loginButton}>Login</button>
                    </div>
                </div>
            }

        </div>
    );
}