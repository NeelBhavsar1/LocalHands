"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";


export default function page() {
  const { t } = useTranslation();
  const PIN_LENGTH = 6;
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const validateEmail = (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return t("forgotPassword.errors.emailRequired");
    }

    if (!/\S+@\S+\.\S+/.test(trimmedValue)) {
      return t("forgotPassword.errors.invalidEmail");
    }

    return "";
  };

  const validatePin = (value) => {
    if (!value.trim()) {
      return t("forgotPassword.errors.pinRequired");
    }

    if (!new RegExp(`^\\d{${PIN_LENGTH}}$`).test(value)) {
      return t("forgotPassword.errors.pinLength");
    }

    return "";
  };

  const checkEmailExists = async (_emailAddress) => {
    //tODO: Implement backend call to verify whether this email exists
    //expected behavior:
    // - return: { exists: true } when the email is registered
    // - return: { exists: false } when the email is not registered
    // - throw an error if the request fails (network/server issue)
    throw new Error("checkEmailExists is not implemented yet.");
  };

  //rewrite later properly
  const submitEmailStep = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});
    setIsCheckingEmail(true);

    try {
      //this is where we will check with the backend if the email exists
      //uf the backend says it does not exist, we show a specific error
      const result = await checkEmailExists(email.trim());

      if (!result.exists) {
        setErrors({ email: t("forgotPassword.errors.emailNotFound") });
        return;
      }

      setStep("pin");
    } catch {
      //temporary fallback while email existence api is not wired up yet
      //remove me aftre implementing checkemailexists
      setStep("pin");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const submitPinStep = (e) => {
    e.preventDefault();
    const pinError = validatePin(pin);

    if (pinError) {
      setErrors({ pin: pinError });
      return;
    }

    setErrors({});
    console.log("PIN submitted for email:", email.trim(), "PIN:", pin);
  };

  return (
    <div className={styles.container}>
      <HomeNavBar showLinks={false} />

      <div className={styles.main}>
        <div className={styles.card}>
          {step === "email" ? (
            <>
              <div className={styles.header}>
                <h1>{t("forgotPassword.emailStep.title")}</h1>
                <p>{t("forgotPassword.emailStep.subtitle")}</p>
              </div>

              <form className={styles.form} onSubmit={submitEmailStep} autoComplete="off">
                <label htmlFor="email">
                  {t("forgotPassword.emailStep.emailLabel")}
                  <input id="email" name="email" type="email" value={email} placeholder={t("forgotPassword.emailStep.emailPlaceholder")} onChange={(e) => setEmail(e.target.value)} required />
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </label>

                <button type="submit" className={styles.submitButton} disabled={isCheckingEmail}>
                  {isCheckingEmail ? t("forgotPassword.emailStep.checkingButton") : t("forgotPassword.emailStep.continueButton")}
                </button>

                <p className={styles.switchAuth}>
                  {t("forgotPassword.emailStep.rememberedPassword")} <Link href="/login">{t("forgotPassword.emailStep.backToLogin")}</Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className={styles.header}>
                <h1>{t("forgotPassword.pinStep.title")}</h1>
                <p>
                  {t("forgotPassword.pinStep.subtitlePrefix")} <strong>{email.trim()}</strong>. {t("forgotPassword.pinStep.subtitleSuffix")}
                </p>
              </div>

              <form className={styles.form} onSubmit={submitPinStep} autoComplete="off">
                <label htmlFor="pin">
                  {t("forgotPassword.pinStep.pinLabel")}
                  <input id="pin" name="pin" type="text" pattern="\d*" maxLength={PIN_LENGTH} value={pin} placeholder="123456" onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} required />
                  {errors.pin && <span className={styles.error}>{errors.pin}</span>}
                </label>

                <button type="submit" className={styles.submitButton}>
                  {t("forgotPassword.pinStep.verifyButton")}
                </button>

                <button type="button" className={styles.backButton} onClick={() => setStep("email")}>
                  {t("forgotPassword.pinStep.useDifferentEmail")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
