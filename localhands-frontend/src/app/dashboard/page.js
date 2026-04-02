"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { getUserInfo } from '@/api/authApi';
import { useRouter } from 'next/navigation';

export default function page({ children }) {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    const loadUser = async () => {
      try {
        const userData = await getUserInfo()
        setUser(userData);

      } catch (error) {
        //unauthenticated user attempts to gain access to dashboard, sending them to login page
        router.push("/login")

      } finally {
        setLoading(false)
      }
    }

    loadUser();
  }, [router])


  if (loading) return <div><LoadingSpinner /></div>
  //if no user data then user object becoems null and redirect to login page
  if (!user) { return null; }


  return (
    <div className={styles.container}>

        <div className={styles.header}>
          <p className={styles.headerTitle}> Welcome Back, {user.firstName}</p>
          <p className={styles.headerSubTitle}>Here's what's happened today.</p>
        </div> 

    </div>
  )
}
