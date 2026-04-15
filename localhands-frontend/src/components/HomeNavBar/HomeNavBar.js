"use client";
import LanguageButton from "../LanguageButton/LanguageButton";
import ToggleButton from "../ToggleButton/ToggleButton";
import styles from "./HomeNavBar.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getUserInfo } from "@/api/userApi";
import { logoutUser } from "@/api/authApi";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function HomeNavBar({ showLinks = true, scrollToSection }) {
    const { t } = useTranslation();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    {/*checks if a user is authenticated, and updates the useState for loggedIn*/}
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

    const handleLogout = async () => {
        try {
            await logoutUser();
            setIsLoggedIn(false);
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
            
            router.push("/");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <a href="/"><Image src="/logo-v2.png" alt={t('alt.localHandsLogo')} width={100} height={100} className={styles.localHandsImage} loading="eager"/></a>
                <p>Local<span>Hands</span></p>
            </div>

            {showLinks && (
            <div className={styles.navLinks}>
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection && scrollToSection('home'); }}>{t("nav.home")}</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection && scrollToSection('about'); }}>{t("nav.about")}</a>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection && scrollToSection('services'); }}>{t("nav.services")}</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection && scrollToSection('contact'); }}>{t("nav.contact")}</a>
            </div>
            )}
            
            <div className={styles.userActions}>
                <LanguageButton />
                <ToggleButton />

                {/*Conditional rendering based on login status and prop passing logic*/}
                {showLinks && (
                    <>
                        {isLoggedIn ? (
                            <>
                                <Link href="/dashboard">
                                    <button className={styles.dashboardButton}>
                                        {t("nav.dashboard")}
                                    </button>
                                </Link>
                                <button onClick={handleLogout} className={styles.logoutButton}>
                                    <LogOut size={16} />
                                    {t("nav.logout")}
                                </button>
                            </>
                        ) : (
                            <Link href="/login">
                                <button className={styles.loginButton}>
                                    {t("nav.login")}
                                </button>
                            </Link>
                        )}
                    </>
                )}
            </div>

            <div className={styles.mobileMenuButton}>
                <button onClick={toggleMobileMenu} className={styles.hamburgerButton}>
                    <Image src="/hamburger.png" alt={t('alt.mobileMenuIcon')} width={30} height={30} className={styles.hamburgerIcon} />
                </button>
            </div>

            {isMobileMenuOpen &&
                <div className={styles.mobileMenu}>
                    {showLinks && 
                    <>
                        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection && scrollToSection('home'); toggleMobileMenu(); }}>{t("nav.home")}</a>
                        <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection && scrollToSection('about'); toggleMobileMenu(); }}>{t("nav.about")}</a>
                        <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection && scrollToSection('services'); toggleMobileMenu(); }}>{t("nav.services")}</a>
                        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection && scrollToSection('contact'); toggleMobileMenu(); }}>{t("nav.contact")}</a>
                    </>
                    }

                    <div className={styles.actionButton}>
                        <LanguageButton onToggleComplete={closeMobileMenu}/>
                        <ToggleButton onToggleComplete={closeMobileMenu}/>
                        {showLinks && (
                            isLoggedIn ? (
                                <>
                                    <a href="/dashboard" onClick={closeMobileMenu}>
                                        <button className={styles.dashboardButton}>{t("nav.dashboard")}</button>
                                    </a>
                                    <button onClick={() => { handleLogout(); closeMobileMenu(); }} className={styles.logoutButton}>
                                        <LogOut size={16} />
                                        {t("nav.logout")}
                                    </button>
                                </>
                            ) : (
                                <a href="/login" onClick={closeMobileMenu}>
                                    <button className={styles.loginButton}>{t("nav.login")}</button>
                                </a>
                            )
                        )}
                    </div>
                </div>
            }

        </div>
    );
}
