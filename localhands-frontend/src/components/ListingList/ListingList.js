import React from 'react'
import styles from './ListingList.module.css'
import ListingCard from '../ListingCard/ListingCard'

export default function ListingList({ listings }) {
    if (!listings || listings.length === 0) {
        return <p>No listing were found, you should create some. Create a listing</p>
    }
  return (
    <div className={styles.container}>
        {listings.map((listing) => (
            <ListingCard key={listing.listingId} listing={listing} />
        ))}
    </div>
  )
}
