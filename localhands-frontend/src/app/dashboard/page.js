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
import { Plus } from 'lucide-react';

export default function page({ children }) {

  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  

  /**
   * This hook initializes the dashboard page, including fetching user data and listings.
   * Since the user must be authenticated in order to access the dashboard page we retrieve
   * user information from the endpoint /api/users/me. 
   */
  useEffect(() => {
    const init = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData);

        /**
         * optional chaining to check the json data the endpoint 
         * returns to see whether a user is a seller. This will return json data such as:
         * {
         *   listingId,
         *   title,
         *   description,
         *   category,
         *   location,
         *   images,
         *   createdAt,
         *   updatedAt
         * }
         */
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
          <p className={styles.headerTitle}>{t('dashboard.welcomeMessage')}{user.firstName}</p>
          <p className={styles.headerSubTitle}>{t('dashboard.subtitle')}</p>
        </div>

        {/*conditional rendering based on user role*/}
        {user?.roles?.includes("SELLER") ? (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t("dashboard.ListingTitle")}</h2>
              <Link href="/dashboard/services" className={styles.createButton}>
                <Plus size={18} />
                {t('dashboard.createListing')}
              </Link>
            </div>
            <ListingList
              listings={listings}
              emptyMessage={t('dashboard.sellerEmptyState')}
            />
          </div>
        ) : (
          <div className={styles.contentSection}>
            <div className={styles.buyerSection}>
              <h2 className={styles.sectionTitle}>{t("dashboard.BuyerTitle")}</h2>
              <p className={styles.buyerSubtitle}>{t("dashboard.BuyerSubtitle")}</p>
              <Link href="/dashboard/services" className={styles.actionButton}>
                {t("dashboard.BuyerButton")}
              </Link>
            </div>
          </div>
        )}
    </div>
  )
}
