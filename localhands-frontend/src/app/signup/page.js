"use client";
//updates in frontend doc 
import React, { useState } from 'react'
import styles from './page.module.css'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { registerUser } from '@/api/registrationApi';
import { validateSignupForm } from '@/utils/validateSignup';

export default function page() {
    const {t} = useTranslation();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
            isServiceProvider: formData.accountType === "provider"
        }

        try {
            await registerUser(requestBody);
            alert("Account created successfully!");
            window.location.href="/login"
        } catch (error) {
            alert("Error: " + error);
        }
        

        //remove me later
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
