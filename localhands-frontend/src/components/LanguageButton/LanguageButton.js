"use client";
import styles from './LanguageButton.module.css'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


export default function LanguageButton() {
    const [isOpen, setIsOpen] = useState(false);
    // useTranslation gives both:
    // - t() for translated text
    // - i18n instance for changeLanguage()
    const { i18n, t } = useTranslation();

    const [selected, setSelected] = useState("EN");

    useEffect(() => {
        // restores the last selected locale after refresh
        const savedLanguage = localStorage.getItem("language") || "en";
        i18n.changeLanguage(savedLanguage);
        setSelected(savedLanguage.toUpperCase())
    }, [i18n]);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (lang) => {
        // lang must match keys defined in src/i18n.js resources
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
        setSelected(lang.toUpperCase());
        setIsOpen(false);
    };

    return (
        <div className={styles.container}>
            <button className={styles.languageButton} onClick={toggleDropdown}>
                <Image src="/language.png" alt="Language Icon" width={24} height={24} className={styles.icon}/>
                <span className={styles.selectedLanguage}>{selected}</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div onClick={() => selectLanguage("en")}>{t("language.english")}</div> 
                    <div onClick={() => selectLanguage("es")}>{t("language.spanish")}</div>
                    <div onClick={() => selectLanguage("fr")}>{t("language.french")}</div>
                    <div onClick={() => selectLanguage("de")}>{t("language.german")}</div>

                </div>
            )}



        </div>
    );
}
