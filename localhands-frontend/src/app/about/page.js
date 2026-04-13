"use client"

import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform} from "framer-motion";

export default function About() {
    const { t } = useTranslation();
    const { scrollX } = useScroll(); //Tracks the position of the user's scroll
    const titleSizeChange = useTransform(scrollX, [0, 300], [1.5, 1]); //Smoother Transformations
    const subtitleTransparency = useTransform(scrollX, [0, 250], [0, 1]);
    const subtitleY = useTransform(scrollX, [0, 250], [40, 0]);

    return (
        <div className={styles.container}>
            <HomeNavBar showLinks={false}/>

            <main className={styles.mainContent}>
                <section className={styles.textSection}>
                    <div className = {styles.headerArea}>
                        <motion.h1 className = {styles.mainTitle} style={{scale: titleSizeChange}}>{t("about.title")}</motion.h1>
                        <motion.p className = {styles.subtTitle} style={{opacity: subtitleTransparency, y: subtitleY}}>{t("about.subtitle")}</motion.p>
                    </div>

                    <div className = {styles.aboutGrid}>
                        <motion.div
                            className={styles.aboutSection}
                            initial={{opacity:0}}
                            whileInView={{opacity:1, y:0}}
                            viewport={{once:true, margin:"-100px"}}
                            transition={{duration:0.6, delay:0.5, ease: "easeOut"}}>

                            <h3>{t("about.gridSection.find.title")}</h3>
                            <p>{t("about.gridSection.find.description")}</p>
                        </motion.div>

                        <motion.div
                            className={styles.aboutSection}
                            initial={{opacity:0, y:50}}
                            whileInView={{opacity:1, y:0}}
                            viewport={{once:true, margin:"-100px"}}
                            transition={{duration:0.6, delay:0.75}}>

                            <h3>{t("about.gridSection.verified.title")}</h3>
                            <p>{t("about.gridSection.verified.description")}</p>
                        </motion.div>

                        <motion.div
                            className={styles.aboutSection}
                            initial={{opacity:0, y:50}}
                            whileInView={{opacity:1, y:0}}
                            viewport={{once:true, margin:"-100px"}}
                            transition={{duration:0.6, delay:0.5}}>

                            <h3>{t("about.gridSection.communication.title")}</h3>
                            <p>{t("about.gridSection.communication.description")}</p>
                        </motion.div>

                        <motion.div
                            className={styles.aboutSection}
                            initial={{opacity:0, y:50}}
                            whileInView={{opacity:1, y:0}}
                            viewport={{once:true, margin:"-100px"}}
                            transition={{duration:0.6, delay:0.75}}>

                            <h3>{t("about.gridSection.secure.title")}</h3>
                            <p>{t("about.gridSection.secure.description")}</p>
                        </motion.div>

                        <motion.div
                            className={styles.aboutSection}
                            initial={{opacity:0, y:50}}
                            whileInView={{opacity:1, y:0}}
                            viewport={{once:true, margin:"-100px"}}
                            transition={{duration:0.6, delay:0.5}}>
                            <h3>{t("about.gridSection.accessible.title")}</h3>
                            <p>{t("about.gridSection.accessible.description")}</p>
                        </motion.div>
                    </div>

                    <motion.div
                        className={styles.missionArea}
                        initial={{opacity:0, y:40}}
                        whileInView={{opacity:1, y:0}}
                        viewport={{once:true, margin: "-100px"}}
                        transition={{duration: 0.8, delay:0.5}}>
                        <h2>{t("about.mission.title")}</h2>
                        <p>{t("about.mission.description")}</p>
                    </motion.div>                   
                </section>
            </main>

            <Footer />
        </div>
    )
}
