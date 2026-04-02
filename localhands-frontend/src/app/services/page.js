"use client"

import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function Services() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <HomeNavBar showLinks={true}/>

            <Footer />
        </div>
    )
}