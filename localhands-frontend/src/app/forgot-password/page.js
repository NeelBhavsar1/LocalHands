"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { sendPasswordResetEmail, verifyPasswordResetCode, resetPassword } from "@/api/passwordResetApi";
import { validateForgotPasswordEmail, validateForgotPasswordPin, validatePasswordReset } from "@/utils/validateForgotPassword";


export default function page() {
  const { t } = useTranslation()
  const router = useRouter()
  const PIN_LENGTH = 6
  const [step, setStep] = useState("email")
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [errors, setErrors] = useState({})
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isVerifyingPin, setIsVerifyingPin] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const submitEmailStep = async (e) => {
    e.preventDefault()
    const emailErrors = validateForgotPasswordEmail(email, t)

    if (Object.keys(emailErrors).length > 0) {
      setErrors(emailErrors)
      return
    }

    setErrors({})
    setIsCheckingEmail(true)

    try {
      await sendPasswordResetEmail(email.trim())
      setStep("pin")
    } catch (error) {
      setErrors({ email: error.message || t("forgotPassword.errors.emailNotFound") })
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleResendEmail = async () => {
    setErrors({})
    setResendMessage("")
    setIsResendingEmail(true)

    try {
      await sendPasswordResetEmail(email.trim())
      setResendMessage(t("forgotPassword.pinStep.resendSuccess") || "Email resent successfully!")
    } catch (error) {
      setErrors({ resend: error.message || t("forgotPassword.errors.resendFailed") })
    } finally {
      setIsResendingEmail(false)
    }
  };

  const submitPinStep = async (e) => {
    e.preventDefault();
    const pinErrors = validateForgotPasswordPin(pin, PIN_LENGTH, t);

    if (Object.keys(pinErrors).length > 0) {
      setErrors(pinErrors)
      return
    }

    setErrors({})
    setIsVerifyingPin(true)

    try {
      const token = await verifyPasswordResetCode(email.trim(), pin);
      setResetToken(token)
      setStep("password")
    } catch (error) {
      setErrors({ pin: error.message || t("forgotPassword.errors.invalidPin") })
    } finally {
      setIsVerifyingPin(false)
    }
  };

  const submitPasswordStep = async (e) => {
    e.preventDefault()
    const passwordErrors = validatePasswordReset(newPassword, confirmPassword, t)

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return
    }

    setErrors({})
    setIsResettingPassword(true)

    try {
      await resetPassword(email.trim(), resetToken, newPassword);
      setSuccessMessage(t("forgotPassword.passwordStep.successMessage"));
      
      //redirect to login after 2 second delay
      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (error) {
      setErrors({ password: error.message || t("forgotPassword.errors.passwordMismatch") });
    } finally {
      setIsResettingPassword(false);
    }
  }

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
                  <input id="email" name="email" type="email" value={email} placeholder={t("forgotPassword.emailStep.emailPlaceholder")} onChange={(e) => setEmail(e.target.value)} required disabled={isCheckingEmail} />
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </label>

                <button type="submit" className={styles.submitButton} disabled={isCheckingEmail}>
                  {isCheckingEmail ? <LoadingSpinner size="small" /> : t("forgotPassword.emailStep.continueButton")}
                </button>

                <p className={styles.switchAuth}>
                  {t("forgotPassword.emailStep.rememberedPassword")} <Link href="/login">{t("forgotPassword.emailStep.backToLogin")}</Link>
                </p>
              </form>
            </>

          ) : step === "pin" ? (
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
                  <input id="pin" name="pin" type="text" pattern="\d*" maxLength={PIN_LENGTH} value={pin} placeholder="123456" onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} required disabled={isVerifyingPin} />
                  {errors.pin && <span className={styles.error}>{errors.pin}</span>}
                </label>

                <button type="submit" className={styles.submitButton} disabled={isVerifyingPin}>
                  {isVerifyingPin ? <LoadingSpinner size="small" /> : t("forgotPassword.pinStep.verifyButton")}
                </button>

                <button type="button" className={styles.resendButton} onClick={handleResendEmail} disabled={isVerifyingPin || isResendingEmail}>
                  {isResendingEmail ? <LoadingSpinner size="small" /> : (t("forgotPassword.pinStep.resendButton") || "Resend email")}
                </button>


                {resendMessage && <span className={styles.success}>{resendMessage}</span>}
                {errors.resend && <span className={styles.error}>{errors.resend}</span>}

                <button type="button" className={styles.backButton} onClick={() => setStep("email")} disabled={isVerifyingPin}>
                  {t("forgotPassword.pinStep.useDifferentEmail")}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className={styles.header}>
                <h1>{t("forgotPassword.passwordStep.title")}</h1>
                <p>{t("forgotPassword.passwordStep.subtitle")} <strong>{email.trim()}</strong></p>
              </div>

              {successMessage ? (
                <div className={styles.successMessage}>
                  {successMessage}
                </div>
              ) : (
                <form className={styles.form} onSubmit={submitPasswordStep} autoComplete="off">
                  <label htmlFor="newPassword">
                    {t("forgotPassword.passwordStep.newPasswordLabel")}
                    <input id="newPassword" name="newPassword" type="password" value={newPassword} placeholder={t("forgotPassword.passwordStep.newPasswordPlaceholder")} onChange={(e) => setNewPassword(e.target.value)} required 
                      disabled={isResettingPassword}
                    />
                    {errors.password && <span className={styles.error}>{errors.password}</span>}
                  </label>

                  <label htmlFor="confirmPassword">
                    {t("forgotPassword.passwordStep.confirmPasswordLabel")}
                    <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} placeholder={t("forgotPassword.passwordStep.confirmPasswordPlaceholder")} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isResettingPassword} />
                    {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                  </label>

                  <button type="submit" className={styles.submitButton} disabled={isResettingPassword}>
                    {isResettingPassword ? <LoadingSpinner size="small" /> : t("forgotPassword.passwordStep.resetButton")}
                  </button>

                  <button type="button" className={styles.backButton} onClick={() => setStep("pin")} disabled={isResettingPassword}>
                    {t("forgotPassword.passwordStep.backToPin")}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
