"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { getUserInfo } from '@/api/userApi';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getMyListings } from '@/api/listingApi';
import ListingList from '@/components/ListingList/ListingList';
import Link from 'next/link';

export default function page({ children }) {

  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData);

        if (userData?.roles?.includes("SELLER")) {
          const listingsData = await getMyListings();
          setListings(listingsData);
        }

      } catch (error) {
        console.error(error);
        router.push("/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) return <div><LoadingSpinner /></div>
  //if no user data then user object becoems null and redirect to login page
  if (!user) { return null; }


  return (
    <div className={styles.container}>

        <div className={styles.header}>
          <p className={styles.headerTitle}> Welcome Back, {user.firstName}</p>
          <p className={styles.headerSubTitle}>Here's what's happened today.</p>
        </div> 

        {user?.roles?.includes("SELLER") ? (
          <div className={styles.listingsSection}>
            <h2>{t("dashboard.ListingTitle")}</h2>
            <ListingList listings={listings} />
          </div>
        ) : (
          <div className={styles.buyerSection}>
            <h2>{t("dashboard.BuyerTitle")}</h2>
            <p>{t("dashboard.BuyerSubtitle")}</p>
            <button><Link href="/dashboard/services" className={styles.viewServicesBtn}>{t("dashboard.BuyerButton")}</Link></button>
          </div>
        )}
    </div>
  )
}
