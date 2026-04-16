"use client";

import Link from 'next/link';
import styles from './Footer.module.css'
import Image from 'next/image'
import { useTranslation } from 'react-i18next';
import { Copyright } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>

      <div className={styles.container}>
          <div className={styles.leftColumn}>
            <Image src="/logo-v2.png" alt={t('alt.localHandsLogo')} width={100} height={100} className={styles.localHandsImage} loading="lazy"/>
            <p>{t('brand.localHands')}</p>
          </div>
          <div className={styles.middleColumns}>
            <h2>{t("footer.links")}</h2>
            <div className={styles.linkColumn}>
              <Link href='/'>{t("footer.home")}</Link>
              <Link href='/faq'>{t("footer.faq")}</Link>
              <Link href='/termsofservice'>{t("footer.termsofservice")}</Link>
              <Link href='/privacypolicy'>{t("footer.privacypolicy")}</Link>
            </div>
          </div>           
      </div>
      <p className={styles.copyWriteLolHailCC}><Copyright size={12} />&nbsp; {t('footer.copyright', { year: new Date().getFullYear() })}</p>
    </div>
  )
}
