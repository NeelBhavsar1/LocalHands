"use client";
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { getUserInfo } from '@/api/authApi';

export default function page({ children }) {

  //use null rather than empty string to indicate no user data yet, and to differentiate from an empty user object
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch (err) {
        console.log("User not logged in or token")
      }
    };

    fetchUser();
  }, [])

  return (
    <div className={styles.container}>
      {user ? (
        <div className={styles.header}>
          <p className={styles.headerTitle}> Welcome Back, {user.firstName}</p>
          <p className={styles.headerSubTitle}>Here's what's happened today.</p>
        </div>



        ) : 
        <div>
          <LoadingSpinner />
        </div>
        }
    </div>
  )
}
