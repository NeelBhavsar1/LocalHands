"use client";
import LanguageButton from "../LanguageButton/LanguageButton";
import ToggleButton from "../ToggleButton/ToggleButton";
import styles from "./HomeNavBar.module.css";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function HomeNavBar({ showLinks = true }) {
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    }

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Link href="/"><Image src="/logo-v2.png" alt="LocalHands Logo" width={100} height={100} className={styles.localHandsImage}/></Link>
                <p>Local<span>Hands</span></p>
            </div>

            {showLinks && (
            <div className={styles.navLinks}>
                <Link href="/home">{t("nav.home")}</Link>
                <Link href="/about">{t("nav.about")}</Link>
                <Link href="/services">{t("nav.services")}</Link>
                <Link href="/contact">{t("nav.contact")}</Link>
            </div>
            )}
            
            <div className={styles.userActions}>
                <LanguageButton/>
                <ToggleButton />
                {showLinks && (<Link href="/login"><button className={styles.loginButton}>{t("nav.login")}</button></Link>)}
            </div>

            <div className={styles.mobileMenuButton}>
                <button onClick={toggleMobileMenu} className={styles.hamburgerButton}>
                    <Image src="/hamburger.png" alt="Mobile Menu Icon" width={30} height={30} className={styles.hamburgerIcon} />
                </button>
            </div>

            {isMobileMenuOpen &&
                <div className={styles.mobileMenu}>
                    {( showLinks && 
                    <>
                        <Link href="/home" onClick={toggleMobileMenu}>{t("nav.home")}</Link>
                        <Link href="/services" onClick={toggleMobileMenu}>{t("nav.services")}</Link>
                        <Link href="/about" onClick={toggleMobileMenu}>{t("nav.about")}</Link>
                        <Link href="/contact" onClick={toggleMobileMenu}>{t("nav.contact")}</Link>
                    </>
                    )}

                    <div className={styles.actionButton}>
                        <LanguageButton onToggleComplete={closeMobileMenu}/>
                        <ToggleButton onToggleComplete={closeMobileMenu}/>
                        {showLinks && (<Link href="/login"><button className={styles.loginButton}>Login</button></Link>)}
                    </div>
                </div>
            }

        </div>
    );
}