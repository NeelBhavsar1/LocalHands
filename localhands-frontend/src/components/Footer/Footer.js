"use client";

import Link from 'next/link';
import styles from './Footer.module.css'
import Image from 'next/image'
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>

      <div className={styles.container}>
          <div className={styles.leftColumn}>
            <Image src="/logo-v2.png" alt="LocalHands Logo" width={100} height={100} className={styles.localHandsImage}/>
            <p>Local<span>Hands</span></p>
          </div>
          <div className={styles.middleColumns}>
            <h2>{t("footer.links")}</h2>
            <div className={styles.linkColumn}>
              <Link href='/'>{t("footer.home")}</Link>
              <Link href='/faq'>{t("footer.faq")}</Link>
              <Link href='/contact'>{t("footer.contactus")}</Link>
              <Link href='/termsofservice'>{t("footer.termsofservice")}</Link>
              <Link href='/privacypolicy'>{t("footer.privacypolicy")}</Link>
              <Link href='/sitemap'>{t("footer.sitemap")}</Link>
            </div>
          </div>           
      </div>
      <p className={styles.copyWriteLolHailCC}>© {new Date().getFullYear()} LocalHands</p>
    </div>
  )
}
