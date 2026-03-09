"use client";

import React from "react";
import styles from "./page.module.css";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Link from "next/link";

export default function page() {
  const submitForm = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
  };

  return (
    <div className={styles.wrapper}>
      <HomeNavBar />

      <main className={styles.main}>

        <section className={styles.card}>

          <div className={styles.header}>
            <h1>Welcome back</h1>
            <p>Log in to continue using LocalHands.</p>
          </div>

          <form name="login-form" className={styles.loginForm} onSubmit={submitForm}>
            <label htmlFor="email">Email
              <input type="email" id="email" name="email" required placeholder="jdoe@gmail.com" autoComplete="email" />
            </label>

            <label htmlFor="password">Password
              <input type="password" id="password" name="password" required placeholder="Enter your password" autoComplete="current-password" />
            </label>

            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input type="checkbox" name="rememberMe" />
                Remember me
              </label>

              <Link href="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.submitForm}>
              Continue
            </button>

            <p className={styles.goToSignUp}>
              Don't have an account?{" "}
              <Link href="/signup">Sign up</Link>
            </p>
          </form>

        </section>

      </main>
      
    </div>
  );
}