"use client"

import React from 'react'
import styles from './page.module.css'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import Link from 'next/link'

export default function page() {

    const submitForm = () => {
        console.log("Form submitted!");
    }

  return (
    <div className={styles.wrapper}>
        <HomeNavBar />
        <h1>LocalHands</h1>

        <div className={styles.container}>  
            
            <form name='login-form' required onChange={submitForm} className={styles.loginForm}>
                <label htmlFor='email'>Email 
                    <input type='email' id='email' name='email' required placeholder='jDoe@gmail.com' />
                </label>

                <label htmlFor='password'>Password
                    <input type='password' id='pasword' name='password' required />
                </label>
                <p className={styles.goToSignUp}>Don't have an account? <span><Link href="/">Click here</Link></span></p>
                <input type='submit' value='Continue' className={styles.submitForm} />

            </form>


        </div>
    </div>
  )
}
