"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function page() {
  const {t} = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({...prev, [name]: value}))
  }

  const validateForm = () => {

    const newErorrs = {};

    if (!formData.email.trim()) {
      newErorrs.email = "Email is required!"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErorrs.email = "Enter a valid email!";
    }

    if (!formData.password) {
      newErorrs.password = "Password is required!"
    } else if (formData.password.length < 8) {
      newErorrs.password = "Password must be at least 8 characters"
    }

    return newErorrs;

  }

  const submitForm = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    console.log("Form submitted!", formData);
  };

  return (
    <div className={styles.wrapper}>
      <HomeNavBar />

      <main className={styles.main}>

        <section className={styles.card}>

          <div className={styles.header}>
            <h1>{t("login.title")}</h1>
            <p>{t("login.subtitle")}</p>
          </div>

          <form name="login-form" className={styles.loginForm} onSubmit={submitForm} autoComplete="off">
            <label htmlFor="email">{t("login.email")}
              <input type="email" id="email" name="email" required placeholder={t("login.emailexample")} value={formData.email} onChange={handleChange} />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </label>

            <label htmlFor="password">{t("login.password")}
              <input type="password" id="password" name="password" required placeholder={t("login.passwordExample")} value={formData.password} onChange={handleChange}/>
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </label>

            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input type="checkbox" name="rememberMe" />
                {t("login.rememberme")}
              </label>

              <Link href="/forgot-password" className={styles.forgotPassword}>
                {t("login.forgotpassword")}
              </Link>
            </div>

            <button type="submit" className={styles.submitForm}>
              {t("login.continue")}
            </button>

            <p className={styles.goToSignUp}>
              {t("login.donthaveanaccount")}{" "}
              <Link href="/signup">{t("login.signup")}</Link>
            </p>
          </form>

        </section>

      </main>
      
    </div>
  );
}