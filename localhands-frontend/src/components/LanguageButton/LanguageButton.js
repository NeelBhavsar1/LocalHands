"use client";
import styles from './LanguageButton.module.css'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


export default function LanguageButton({ onToggleComplete }) {
    const [isOpen, setIsOpen] = useState(false);
    const { i18n, t } = useTranslation();

    const supportedLangs = ["en", "es", "fr", "de"];
    const displayByLang = {
        en: "EN",
        es: "ES",
        fr: "FR",
        de: "DE",
    };

    const [selected, setSelected] = useState("EN");

    useEffect(() => {
        const savedLanguage = (localStorage.getItem("language") || "en").toLowerCase();
        const normalized = supportedLangs.includes(savedLanguage) ? savedLanguage : "en";

        i18n.changeLanguage(normalized);
        setSelected(displayByLang[normalized] ?? normalized.toUpperCase());
    }, [i18n]);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);

        
    };

    const selectLanguage = (lang) => {
        const normalized = supportedLangs.includes(lang.toLowerCase()) ? lang.toLowerCase() : "en";
        i18n.changeLanguage(normalized);
        localStorage.setItem("language", normalized);
        setSelected(displayByLang[normalized] ?? normalized.toUpperCase());
        setIsOpen(false);

        if (onToggleComplete) {
            onToggleComplete();
        }
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
