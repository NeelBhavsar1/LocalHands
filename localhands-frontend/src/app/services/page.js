"use client"

import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Services() {
    const { t } = useTranslation();
    const rowAnimation = { hidden: {opacity: 0, x: -30}, visible: {opacity: 1, x:0}};
    

    return (
        <div className={styles.container}>
            <HomeNavBar showLinks={false}/>

            <main className = {styles.mainContent}>
                <div className = {styles.headerArea}>
                    <motion.h1 className = {styles.mainTitle} initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration:0.5}}>{t("services.title")}</motion.h1>
                    <motion.p className = {styles.subtitle} initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration:0.5, delay:0.5}}>{t("services.subtitle")}</motion.p>
                </div>

                <motion.div className={styles.directoryList} initial="hidden" whileInView="visible" viewport={{once: true, margin: "-50px"}} transition={{staggerChildren: 0.15}}>
                    <motion.div className={styles.serviceRow} variants={rowVariant} transition={{duration: 0.5}}>
                        <div className={styles.rowContent}>
                            <h2>{t("services.category.home.title")}</h2>
                            <p>{t("services.category.home.description")}</p>
                        </div>
                    </motion.div>

                    <motion.div className={styles.serviceRow} variants={rowVariant} transition={{duration: 0.5}}>
                        <div className={styles.rowContent}>
                            <h2>{t("services.category.outdoor.title")}</h2>
                            <p>{t("services.category.outdoor.description")}</p>
                        </div>
                    </motion.div>

                    <motion.div className={styles.serviceRow} variants={rowVariant} transition={{duration: 0.5}}>
                        <div className={styles.rowContent}>
                            <h2>{t("services.category.errands.title")}</h2>
                            <p>{t("services.category.errands.description")}</p>
                        </div>
                    </motion.div>

                    <motion.div className={styles.serviceRow} variants={rowVariant} transition={{duration: 0.5}}>
                        <div className={styles.rowContent}>
                            <h2>{t("services.category.pets.title")}</h2>
                            <p>{t("services.category.pets.description")}</p>
                        </div>
                    </motion.div>

                    <motion.div className={styles.serviceRow} variants={rowVariant} transition={{duration: 0.5}}>
                        <div className={styles.rowContent}>
                            <h2>{t("services.category.tech.title")}</h2>
                            <p>{t("services.category.tech.description")}</p>
                        </div>
                    </motion.div>

                    <motion.div className={styles.serviceRow} variants={rowVariant} transition={{duration: 0.5}}>
                        <div className={styles.rowContent}>
                            <h2>{t("services.category.professional.title")}</h2>
                            <p>{t("services.category.professional.description")}</p>
                        </div>
                    </motion.div>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}
