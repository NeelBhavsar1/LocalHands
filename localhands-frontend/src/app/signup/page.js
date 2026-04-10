"use client";
//updates in frontend doc 
import React, { useState } from 'react'
import styles from './page.module.css'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { registerUser } from '@/api/registrationApi';
import { validateSignupForm } from '@/utils/validateSignup';

export default function page() {
    const {t} = useTranslation();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isServiceProvider: false,
        isConsumer: false,
        dateOfBirth: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
        }));
    };


    const submitForm = async (e) => {
        e.preventDefault();

        const validationErrors = validateSignupForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        //do not send confirmPassword to backend only for frontend validation
        const requestBody = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            dateOfBirth: formData.dateOfBirth || null,
            isServiceProvider: formData.isServiceProvider,
            isConsumer: formData.isConsumer,
            rememberMe: formData.rememberMe
        }

        try {
            await registerUser(requestBody);
            alert("Account created successfully! Check your email to verify your account.");
            router.push("/dashboard");
        } catch (error) {
            alert("Error: " + error);
        }
        

        //remove me later
        console.log("Form submitted!", formData);
    }

    const handleRoleChange = (role, isChecked) => {
        setFormData((prev) => ({ ...prev, [role]: isChecked }))
    };

  return (
    <div className={styles.wrapper}>
        <HomeNavBar showLinks={false}/>

        <div className={styles.main}>
            <div className={styles.card}>

                <div className={styles.header}>
                    <h1>{t("signup.title")}</h1>
                    <p>{t("signup.subtitle")}</p>
                </div>

                <form name="signup-form" className={styles.signUpForm} onSubmit={submitForm} autoComplete='off'>
                    <div className={styles.formGrid}>

                        <div className={styles.leftColumn}>
                            <label htmlFor='firstName'>{t("signup.fname")}
                                <input type='text' id='firstName' name='firstName' required placeholder={t("signup.fnameExample")} value={formData.firstName} onChange={handleChange}/>
                                {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                            </label>

                            <label htmlFor='lastName'>{t("signup.lname")}
                                <input type='text' id='lastName' name='lastName' required placeholder={t("signup.lnameExample")} value={formData.lastName} onChange={handleChange}/>
                                {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                            </label>

                            <label htmlFor='email'>{t("signup.email")}
                                <input type='email' id='email' name='email' required placeholder={t("signup.emailExample")} value={formData.email} onChange={handleChange}/>
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </label>

                            <label htmlFor='dateOfBirth'>{t("signup.dateOfBirth")}
                                <input type='date' id='dateOfBirth' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange}/>
                                {errors.dateOfBirth && <span className={styles.error}>{errors.dateOfBirth}</span>}
                            </label>
                        </div>

                        <div className={styles.rightColumn}>
                            <label htmlFor='password'>{t("signup.password")}
                                <input type='password' id='password' name='password' required placeholder='**********' value={formData.password} onChange={handleChange}/>
                                {errors.password && <span className={styles.error}>{errors.password}</span>}
                            </label>

                            <label htmlFor='confirmPassword'>{t("signup.confirmPassword")}
                                <input type='password' id='confirmPassword' name='confirmPassword' required placeholder='**********' value={formData.confirmPassword} onChange={handleChange}/>
                                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                            </label>

                            <label>{t("signup.accountType")}
                                <div className={styles.accountTypeOptions}>
                                    <label className={styles.accountTypeOptionLabel}>
                                        <input type="checkbox" checked={formData.isServiceProvider} onChange={(e) => handleRoleChange("isServiceProvider", e.target.checked)}/>
                                        {t("signup.customerAndProvider")}
                                    </label>

                                    <label className={styles.accountTypeOptionLabel}>
                                        <input type="checkbox" checked={formData.isConsumer} onChange={(e) => handleRoleChange("isConsumer", e.target.checked)}/>
                                        {t("signup.customerOnly")}
                                    </label>
                                </div>

                                {(errors.isServiceProvider || errors.isConsumer) && <span className={styles.error}>{errors.isServiceProvider || errors.isConsumer}</span>}
                            </label>

                            <label className={styles.rememberMe}>
                                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}/>
                                {t("signup.rememberme")}
                            </label>
                        </div>

                    </div>

                    <button type='submit' className={styles.submitForm}>
                        {t("signup.continue")}
                    </button>

                    <p className={styles.goToLogin}>
                        {t("signup.alreadyhaveanaccount")}{" "}
                        <Link href="/login">{t("signup.login")}</Link>
                    </p>

                </form>

            </div>
        </div>

    </div>
  )
}
