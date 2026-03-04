"use client";

import Link from 'next/link';
import styles from './Footer.module.css'
import Image from 'next/image'

export default function Footer() {
  return (
    <div className={styles.wrapper}>

      <div className={styles.container}>
          <div className={styles.leftColumn}>
            <Image src="/logo-v2.png" alt="LocalHands Logo" width={100} height={100} className={styles.localHandsImage}/>
            <p>Local<span>Hands</span></p>
          </div>
          <div className={styles.middleColumns}>
            <h2>Links</h2>
            <div className={styles.linkColumn}>
              <Link href='/'>Home</Link>
              <Link href='/'>FAQ</Link>
              <Link href='/'>Contact Us</Link>
              <Link href='/'>Terms of Service</Link>
              <Link href='/'>Privacy Policy</Link>
              <Link href='/'>Site Map</Link>
            </div>
          </div>           
      </div>
      <p className={styles.copyWriteLolHailCC}>© {new Date().getFullYear()} LocalHands</p>
    </div>
  )
}
