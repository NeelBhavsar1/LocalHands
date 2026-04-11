"use client";
import LanguageButton from "../LanguageButton/LanguageButton";
import ToggleButton from "../ToggleButton/ToggleButton";
import styles from "./HomeNavBar.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getUserInfo } from "@/api/userApi";

export default function HomeNavBar({ showLinks = true }) {
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUserInfo();
                setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    }

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <a href="/"><Image src="/logo-v2.png" alt="LocalHands Logo" width={100} height={100} className={styles.localHandsImage}/></a>
                <p>Local<span>Hands</span></p>
            </div>

            {showLinks && (
            <div className={styles.navLinks}>
                <a href="/home">{t("nav.home")}</a>
                <a href="/about">{t("nav.about")}</a>
                <a href="/services">{t("nav.services")}</a>
                <a href="/contact">{t("nav.contact")}</a>
            </div>
            )}
            
            <div className={styles.userActions}>
                <LanguageButton />
                <ToggleButton />

                {showLinks && (
                    <>
                        {isLoggedIn && (
                            <Link href="/dashboard">
                                <button className={styles.dashboardButton}>
                                    {t("nav.dashboard")}
                                </button>
                            </Link>
                        )}

                        <Link href="/login">
                            <button className={styles.loginButton}>
                                {t("nav.login")}
                            </button>
                        </Link>
                    </>
                )}
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
                        <a href="/home" onClick={toggleMobileMenu}>{t("nav.home")}</a>
                        <a href="/services" onClick={toggleMobileMenu}>{t("nav.services")}</a>
                        <a href="/about" onClick={toggleMobileMenu}>{t("nav.about")}</a>
                        <a href="/contact" onClick={toggleMobileMenu}>{t("nav.contact")}</a>
                    </>
                    )}

                    <div className={styles.actionButton}>
                        <LanguageButton onToggleComplete={closeMobileMenu}/>
                        <ToggleButton onToggleComplete={closeMobileMenu}/>
                        {showLinks && (
                            isLoggedIn ? (
                                <a href="/dashboard" onClick={closeMobileMenu}><button className={styles.dashboardButton}>{t("nav.dashboard")}</button></a>
                            ) : (
                                <a href="/login" onClick={closeMobileMenu}><button className={styles.loginButton}>{t("nav.login")}</button></a>
                            )
                        )}
                    </div>
                </div>
            }

        </div>
    );
}
