"use client"

import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function TermsOfService() {
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
                        <h1 className={styles.title}>{t("tos.title")}</h1>
                        <p className={styles.lastUpdated}>{t("tos.lastUpdated")}</p>
                    </motion.div>
                
                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("tos.intro.title")}</h2>
                        <p>{t("tos.intro.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("tos.accounts.title")}</h2>
                        <p>{t("tos.accounts.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("tos.marketplace.title")}</h2>
                        <p>{t("tos.marketplace.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("tos.acceptableUse.title")}</h2>
                        <p>{t("tos.acceptableUse.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("tos.payments.title")}</h2>
                        <p>{t("tos.payments.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("tos.reviews.title")}</h2>
                        <p>{t("tos.reviews.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("tos.liability.title")}</h2>
                        <p>{t("tos.acceptableUse.content")}</p>
                    </motion.section>

                    <motion.section className={styles.section} {...contentAnimation}>
                        <h2>{t("tos.changes.title")}</h2>
                        <p>{t("tos.changes.content")}</p>
                    </motion.section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
