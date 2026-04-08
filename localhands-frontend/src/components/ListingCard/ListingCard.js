import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './ListingCard.module.css'

// Get backend URL from environment or default to localhost
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export default function ListingCard({ listing }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/dashboard/listings/${listing.listingId}`)
  }

  // Safety check for photos
  // TODO: Add proper error handling for missing photos
  const hasPhotos = listing.photos && listing.photos.length > 0
  const photoUrl = hasPhotos ? `${BACKEND_URL}${listing.photos[0].url}` : '/placeholder.png'
  const photoAlt = hasPhotos ? listing.photos[0].altText : "No image available"

  return (
    <div className={styles.card} onClick={handleClick}>
        <div className={styles.imageContainer}>
            <img src={photoUrl} alt={photoAlt} className={styles.image} />
        </div>
        
        <div className={styles.content}>
            <h3 className={styles.name}>{listing.name}</h3>
            <p className={styles.description}>{listing.description}</p>
            
            <div className={styles.footer}>
                <span className={styles.location}>
                    {listing.latitude?.toFixed(4)}, {listing.longitude?.toFixed(4)}
                </span>
                <span className={styles.date}>
                    {new Date(listing.creationTime).toLocaleDateString()}
                </span>
            </div>
        </div>
    </div>
  )
}
