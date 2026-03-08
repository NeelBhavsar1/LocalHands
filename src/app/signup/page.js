"use client";

import React from 'react'
import styles from './page.module.css'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import Link from 'next/link';

export default function page() {

    const submitForm = (e) => {
        e.preventDefault();
        console.log("Form submitted!");
    }

  return (
    <div className={styles.wrapper}>
        <HomeNavBar />

        <div className={styles.main}>
            <div className={styles.card}>

                <div className={styles.header}>
                    <h1>Welcome to LocalHands</h1>
                    <p>Please submit your information to use LocalHands</p>
                </div>

                <form name="signup-form" className={styles.signUpForm} onSubmit={submitForm}>

                    <label htmlFor='fname'>First Name
                        <input type='text' id='fname' name='fname' required placeholder='John' autoComplete='name' />
                    </label>

                    <label htmlFor='lname'>Last Name
                        <input type='text' id='lname' name='lname' required placeholder='Doe' />
                    </label>

                    <label htmlFor='password'>Password
                        <input type='password' id='password' name='password' required/>
                    </label>

                    <label htmlFor='confirmPassword'>Confirm Password
                        <input type='password' id='password2' name='password2' required/>
                    </label>

                    <button type='submit' className={styles.submitForm}>
                        Continue
                    </button>

                    <p className={styles.goToLogin}>
                        Already have an account?{" "}
                        <Link href="/login">Login</Link>
                    </p>


                </form>

            </div>
        </div>



    </div>
  )
}
