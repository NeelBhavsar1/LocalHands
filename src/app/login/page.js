"use client";

import React from "react";
import styles from "./page.module.css";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";

export default function Page() {

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
      <div className={styles.container}>
        <div className={styles.card}>
        <h1>Welcome Back</h1> 
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <label>Email <input type="email" name="email" required placeholder="john@example.com"/></label>

          <label>Password <input type="password" name="password" required placeholder="Enter your password"/></label>

          <button type="submit">Sign in</button>
        </form>

        <p>Don’t have an account?{" "} <span className={styles.reRoute}>Sign up</span></p>
        </div>
      </div>
  );
}