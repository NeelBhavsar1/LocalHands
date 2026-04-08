"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { getUserInfo } from '@/api/userApi';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getMyListings } from '@/api/listingApi';
import ListingList from '@/components/ListingList/ListingList';

export default function page({ children }) {

  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserInfo()
        setUser(userData)
        

      } catch (error) {
        console.error(error)
        router.push("/login")

      } finally {
        setLoading(false)
      }
    }

    

    const fetchListings = async() => {
      try {
        const data = await getMyListings();
        setListings(data);
      }
      catch (error) {
        console.log(error);
      }
    }

    loadUser()
    fetchListings()
  }, [])


  if (loading) return <div><LoadingSpinner /></div>
  //if no user data then user object becoems null and redirect to login page
  if (!user) { return null; }


  return (
    <div className={styles.container}>

        <div className={styles.header}>
          <p className={styles.headerTitle}> Welcome Back, {user.firstName}</p>
          <p className={styles.headerSubTitle}>Here's what's happened today.</p>
        </div> 

        <div className={styles.listingsSection}>
          <h2>Your Listings</h2>
          <ListingList listings={listings} />
        </div>

    </div>
  )
}
