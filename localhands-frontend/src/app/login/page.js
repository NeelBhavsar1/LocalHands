"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateLoginForm } from "@/utils/validateLogin";
import { loginUser } from "@/api/authApi";
import { useTranslation } from "react-i18next";

export default function page() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    //... is the spread operator and is the quickest way of copying an existing object into another one
    //prev is the previous state
    //[name] is the key of the object
    //type === "checkbox" ? checked : value is the value of the object
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await loginUser({email: formData.email, password: formData.password, rememberMe: formData.rememberMe})
      alert("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      alert("Error: " + error);
    }

  };

  return (
    <div className={styles.wrapper}>
      <HomeNavBar showLinks={false}/>

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
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}/>
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