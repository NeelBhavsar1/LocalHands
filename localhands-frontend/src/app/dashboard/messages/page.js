"use client"
import styles from './page.module.css'
import { useTranslation } from 'react-i18next'

export default function Messages() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1>{t("dashboard.messages.title")}</h1>
        </div>
    )
}