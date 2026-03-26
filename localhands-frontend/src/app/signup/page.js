"use client";
//updates in frontend doc 
import React, { useState } from 'react'
import styles from './page.module.css'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function page() {
    const {t} = useTranslation();

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({...prev, [name]: value}));
    }

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fname.trim()) {
            newErrors.fname = "First name is required!"
        }

        if (!formData.lname.trim()) {
            newErrors.lname = "Last name is required!"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email address is required!"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.accountType) {
            newErrors.accountType = "Please select an account type";
        }

        return newErrors;
    }

    const submitForm = (e) => {
        e.preventDefault();

        const validationErorrs = validateForm();
        setErrors(validationErorrs);

        if (Object.keys(validationErorrs).length > 0) {
            return;
        }

        console.log("Form submitted!", formData);
    }

    const setAccountTypeFromCheckbox = (type, isChecked) => {
        // Enforce "one selected": selecting a checkbox sets `accountType`,
        // unchecking clears it (so validation can show an error)
        if (!isChecked) {
            setFormData((prev) => ({ ...prev, accountType: "" }));
            return;
        }

        setFormData((prev) => ({ ...prev, accountType: type }));
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
                            <label htmlFor='fname'>{t("signup.fname")}
                                <input type='text' id='fname' name='fname' required placeholder={t("signup.fnameExample")} value={formData.fname} onChange={handleChange}/>
                                {errors.fname && <span className={styles.error}>{errors.fname}</span>}
                            </label>

                            <label htmlFor='lname'>{t("signup.lname")}
                                <input type='text' id='lname' name='lname' required placeholder={t("signup.lnameExample")} value={formData.lname} onChange={handleChange}/>
                                {errors.lname && <span className={styles.error}>{errors.lname}</span>}
                            </label>

                            <label htmlFor='email'>{t("signup.email")}
                                <input type='email' id='email' name='email' required placeholder={t("signup.emailExample")} value={formData.email} onChange={handleChange}/>
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
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

                            <label htmlFor='accountType'>{t("signup.accountType")}
                                <div className={styles.accountTypeOptions}>
                                    <label className={styles.accountTypeOptionLabel} htmlFor="accountTypeProvider">
                                        <input type="checkbox" id="accountTypeProvider" name="accountTypeProvider" checked={formData.accountType === "provider"} onChange={(e) => setAccountTypeFromCheckbox("provider", e.target.checked)}/>
                                        {t("signup.provider")}
                                    </label>

                                    <label className={styles.accountTypeOptionLabel} htmlFor="accountTypeCustomer">
                                        <input type="checkbox" id="accountTypeCustomer" name="accountTypeCustomer" checked={formData.accountType === "customer"} onChange={(e) => setAccountTypeFromCheckbox("customer", e.target.checked)}/>
                                        {t("signup.customer")}
                                    </label>
                                </div>

                                {errors.accountType && <span className={styles.error}>{errors.accountType}</span>}
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
