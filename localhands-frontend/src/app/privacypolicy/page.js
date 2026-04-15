"use client"

import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    const { t } = useTranslation();
    const contentAnimation = {
        initial: {opacity: 0, y: 30},
        whileInView: {opacity: 1, y: 0},
        viewport: {once: true, margin: "-50px"},
        transition: {duration: 0.6, ease: "easeOut"}

        
    };

    return (
        <div className={styles.container}>
            <HomeNavBar showLinks={false}/>

            <main className={styles.mainContent}>
                <div className={styles.documentWrapper}>
                    <motion.div {...contentAnimation}>
                        <h1 className={styles.title}>{t("privacy.title")}</h1>
                        <p className={styles.lastUpdated}>{t("privacy.lastUpdated")}</p>
                    </motion.div>
                
                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("privacy.intro.title")}</h2>
                        <p>{t("privacy.intro.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("privacy.collection.title")}</h2>
                        <p>{t("privacy.collection.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("privacy.usage.title")}</h2>
                        <p>{t("privacy.usage.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("privacy.sharing.title")}</h2>
                        <p>{t("privacy.sharing.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("privacy.security.title")}</h2>
                        <p>{t("privacy.security.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("privacy.rights.title")}</h2>
                        <p>{t("privacy.rights.content")}</p>
                    </motion.section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
