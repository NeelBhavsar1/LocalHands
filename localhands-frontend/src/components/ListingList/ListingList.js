import React from 'react'
import styles from './ListingList.module.css'
import ListingCard from '../ListingCard/ListingCard'
import { useTranslation } from 'react-i18next'

export default function ListingList({ listings, emptyMessage }) {
    const { t } = useTranslation()

    //add proper error handling for missing listings
    if (!listings || listings.length === 0) {
        return <p className={styles.emptyMessage}>{emptyMessage || t('dashboard.noListings')}</p>
    }
  return (
    <div className={styles.container}>
        {listings.map((listing) => (
            <ListingCard key={listing.listingId} listing={listing} />
        ))}
    </div>
  )
}
