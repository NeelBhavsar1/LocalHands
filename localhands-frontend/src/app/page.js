"use client"

import ToggleButton from "@/components/ToggleButton/ToggleButton";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import LanguageButton from "@/components/LanguageButton/LanguageButton";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function Home() {

  // use keys that exist in src/locales/<lang>/common.json.
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      
      <HomeNavBar showLinks={true}/>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {t("hero.title")}<br/> 
            <span className={styles.titleSecond}>{t("hero.titleSecond")}</span>
          </h1>
          <p className={styles.subtitle}>{t("hero.subtitle")}</p>

          <div className={styles.buttonGroup}>
            <Link href="/signup" className={styles.tryButton}>
              {t("hero.buttonTry")}
            </Link>
            <button className={styles.howButton}>{t("hero.buttonHow")}</button>
          </div>
        </div>


      </section>

      <Footer />

    </div>
  );
}