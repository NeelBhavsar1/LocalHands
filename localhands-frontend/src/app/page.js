"use client"

import ToggleButton from "@/components/ToggleButton/ToggleButton";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import LanguageButton from "@/components/LanguageButton/LanguageButton";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Home() {

  // use keys that exist in src/locales/<lang>/common.json.
  const { t } = useTranslation();

  return (
    <div className={styles.container}>

      <HomeNavBar showLinks={true}/>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t("hero.title")}</h1>
          <p className={styles.subtitle}>{t("hero.subtitle")}</p>
        </div>


      </section>

      <Footer />

    </div>
  );
}