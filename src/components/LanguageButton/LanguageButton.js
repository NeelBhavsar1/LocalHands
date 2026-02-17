"use client";
import styles from './LanguageButton.module.css'
import Image from 'next/image';
import { useState } from 'react';


/*
Features to implement:
1) Language selection dropdown using next-i18next
*/
export default function LanguageButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("EN");

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (lang) => {
        setSelected(lang);
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
                    <div onClick={() => selectLanguage("EN")}>English</div> 
                    <div onClick={() => selectLanguage("ES")}>Spanish</div>
                    <div onClick={() => selectLanguage("FR")}>French</div>
                    <div onClick={() => selectLanguage("DE")}>German</div>

                </div>
            )}



        </div>
    );
}
