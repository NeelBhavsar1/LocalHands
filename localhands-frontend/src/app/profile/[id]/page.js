"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import styles from './page.module.css'
import { getPublicProfile, getUserInfo } from '@/api/userApi'
import { BACKEND_URL } from '@/utils/listingUtils'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import Link from 'next/link'
import { MapPin, MessageCircle, ArrowLeft, Star, ExternalLink } from 'lucide-react'

export default function PublicProfilePage() {
    const { id } = useParams()
    const router = useRouter()
    const { t } = useTranslation()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = parseInt(id)
                
                if (isNaN(userId)) {
                    setError(t('errors.invalidUserId'))
                    setLoading(false)
                    return
                }
                const data = await getPublicProfile(userId)
                setProfile(data)
            } catch (err) {
                console.error('Failed to fetch profile:', err)
                setError(err.message || t('errors.failedToLoadProfile'))
            } finally {
                setLoading(false)
            }
        }

        const fetchCurrentUser = async () => {
            try {
                const userInfo = await getUserInfo()
                setCurrentUser(userInfo)
            } catch (err) {
                console.error('Failed to fetch current user:', err)
            }
        }

        fetchProfile()
        fetchCurrentUser()
    }, [id])

    const handleMessageClick = () => {
        router.push(`/dashboard/messages?userId=${id}`)
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <LoadingSpinner />
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>{error || t('errors.profileNotFound')}</h2>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        <ArrowLeft size={20} />
                        {t('common.back')}
                    </button>
                </div>
            </div>
        )
    }

    const isServiceProvider = profile.roles?.includes('SELLER')
    const isOwnProfile = currentUser && currentUser.id === profile.id

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backButton}>
                    <ArrowLeft size={20} />
                    {t('common.back')}
                </button>
            </div>

            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <img src={profile.profilePhoto?.url ? `${BACKEND_URL}${profile.profilePhoto.url}` : '/profile.png'} alt={`${profile.firstName} ${profile.lastName}`} className={styles.profilePicture} />
                    <div className={styles.profileInfo}>

                        <h1 className={styles.name}>{profile.firstName} {profile.lastName}</h1>
                        {isServiceProvider && (
                            <span className={styles.badge}>{t('profile.serviceProvider')}</span>
                        )}
                        {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
                    </div>

                </div>

                <div className={styles.actions}>
                    <button onClick={handleMessageClick} className={styles.messageButton}>
                        <MessageCircle size={20} />
                        {t('listing.messageSeller')}
                    </button>
                </div>
            </div>

            {isServiceProvider && profile.listings && profile.listings.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{isOwnProfile ? t('profile.yourListings') : t('profile.userListings')}</h2>
                    <div className={styles.listingsGrid}>

                        {profile.listings.map((listing) => (
                            <Link key={listing.listingId || listing.id} href={`/dashboard/listings/${listing.listingId || listing.id}`} className={styles.listingCard}>
                                <div className={styles.listingImageContainer}>

                                    {listing.photos && listing.photos[0] ? (
                                        <img src={`${BACKEND_URL}${listing.photos[0].url || listing.photos[0]}`} alt={listing.name} className={styles.listingImage} />
                                    ) : (
                                        <div className={styles.noImage}>{t('alt.noImage')}</div>
                                    )}
                                </div>

                                <div className={styles.listingInfo}>
                                    <h3 className={styles.listingName}>{listing.name}</h3>
                                    <div className={styles.listingMeta}>
                                        <span className={styles.workType}>{listing.workType === 'ONLINE' ? t('search.workType.online') : t('search.workType.inPerson')}</span>
                                        {listing.workType === 'ONLINE' ? (
                                            <span className={styles.location}>
                                                <MapPin size={14} />
                                                {t('search.workType.online')}
                                            </span>
                                        ) : listing.latitude && listing.longitude && listing.latitude !== 0 && listing.longitude !== 0 ? (
                                            <span className={styles.location}>
                                                <MapPin size={14} />
                                                {t('serviceLocation')}
                                            </span>
                                        ) : null}
                                    </div>

                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {profile.reviews && profile.reviews.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{isOwnProfile ? t('profile.yourReviews') : t('profile.userReviews')}</h2>
                    
                    <div className={styles.reviewsList}>
                        {profile.reviews.map((review) => (
                            <div key={review.id} className={styles.reviewCard}>

                                <div className={styles.reviewHeader}>
                                    <Link href={`/dashboard/listings/${review.listingId}`} className={styles.reviewListingLink}>
                                        {review.listingName}
                                    </Link>
                                    <div className={styles.rating}>

                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < review.rating ? styles.starFilled : styles.starEmpty} />
                                        ))}

                                    </div>

                                </div>
                                
                                <p className={styles.reviewBody}>{review.reviewBody}</p>
                                
                                <div className={styles.reviewFooter}>
                                    <span className={styles.reviewDate}>
                                        {new Date(review.creationTime).toLocaleDateString()}
                                    </span>
                                    
                                    {review.listingId && (
                                        <Link href={`/dashboard/listings/${review.listingId}`} className={styles.viewListingBtn} title={t('viewListing')}>
                                            <ExternalLink size={14} />
                                            <span>{t('viewListing')}</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
