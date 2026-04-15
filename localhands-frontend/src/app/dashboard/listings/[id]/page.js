"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './page.module.css'
import { getListingById, updateListing, deleteListing, getCategories } from '@/api/listingApi'
import { getUserInfo } from '@/api/userApi'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import ReviewModal from '@/components/ReviewModal/ReviewModal'
import ReviewsSection from '@/components/ReviewsSection/ReviewsSection'
import { BACKEND_URL, getDefaultIcon, createEditChangeHandler, createPhotoChangeHandler, createMapLocationHandler, validateListingForm, generateAltTexts, getCategoryDisplayName, createReviewChangeHandler, submitReview, createCategoryToggleHandler, updateReviewInListing, removeReviewFromListing } from '@/utils/listingUtils'
import { useTranslation } from 'react-i18next'
import { MessageCircle, UserStar } from 'lucide-react'
import Link from 'next/link'

const MapWithNoSSR = dynamic(() => import('@/components/LocationPicker/LocationPicker'), { ssr: false })

export default function ListingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const listingId = params.id

    const [listing, setListing] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [newPhotos, setNewPhotos] = useState([])
    const [saving, setSaving] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const { t } = useTranslation()
    const [review, setReview] = useState(false)
    const [reviewForm, setReviewForm] = useState({ rating: 5, reviewBody: '' })
    const [submittingReview, setSubmittingReview] = useState(false)

    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        latitude: '',
        longitude: ''
    })
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingData, userData, categoriesData] = await Promise.all([getListingById(listingId), getUserInfo(), getCategories()])

                setListing(listingData)
                setCurrentUser(userData)
                setCategories(categoriesData)
                setEditForm({
                    name: listingData.name,
                    description: listingData.description,
                    latitude: listingData.latitude,
                    longitude: listingData.longitude
                })
                
                if (listingData.categories && listingData.categories.length > 0) {
                    setSelectedCategories(listingData.categories.map(cat => cat.id))
                }

            } catch (error) {
                console.error('Error fetching listing:', error)
                alert('Failed to load listing')
                router.push('/dashboard')

            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [listingId, router])

    const isOwner = currentUser && listing && currentUser.id === listing.seller?.id

    const handleEditChange = createEditChangeHandler(setEditForm)

    const handlePhotoChange = createPhotoChangeHandler(setNewPhotos)

    const handleMapLocationSelect = createMapLocationHandler(setEditForm)

    const handleCategoryToggle = createCategoryToggleHandler(setSelectedCategories)

    const writeReview = () => {
        setReview(true)
    }

    const closeReview = () => {
        setReview(false)
        setReviewForm({ rating: 5, reviewBody: '' })
    }

    const handleReviewChange = createReviewChangeHandler(setReviewForm)

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        setSubmittingReview(true)

        try {
            await submitReview(BACKEND_URL, listingId, reviewForm)
            alert('Review submitted successfully!')
            closeReview()
            //refreshes page on successful reviw submission
            window.location.reload()
        } catch (error) {
            alert('Error submitting review: ' + error.message)
        } finally {
            setSubmittingReview(false)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        if (!isOwner) {
            alert('You can only edit your own listings')
            return
        }

        const validation = validateListingForm(editForm, newPhotos, selectedCategories, listing?.workType || 'ONLINE', true)
        if (!validation.valid) {
            alert(validation.error)
            return
        }

        setSaving(true)
        try {
            const altTexts = generateAltTexts(newPhotos, editForm.name)
            const updated = await updateListing(listingId, validation.data, newPhotos, altTexts)
            setListing(updated)
            setIsEditing(false)
            setNewPhotos([])
            alert('Listing updated successfully!')

        } catch (error) {
            alert('Error updating listing: ' + error)

        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!isOwner) {
            alert('You can only delete your own listings')
            return
        }

        if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            return
        }

        try {
            await deleteListing(listingId)
            alert('Listing deleted successfully!')
            router.push('/dashboard')

        } catch (error) {
            alert('Error deleting listing: ' + error)
        }
    }

    if (loading) {
        return <div className={styles.container}><LoadingSpinner /></div>
    }

    if (!listing) {
        return <div className={styles.container}>Listing not found</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backButton}>
                    {t('back')}
                </button>
                
                {isOwner && !isEditing && (
                    <div className={styles.actions}>
                        <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                            {t('editListing')}
                        </button>
                        <button onClick={handleDelete} className={styles.deleteButton}>
                            {t('deleteListing')}
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate} className={styles.editForm}>
                    <h2>{t('editListing')}</h2>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="name">{t('serviceName')}</label>
                        <input type="text" id="name" name="name" value={editForm.name} onChange={handleEditChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">{t('description')}</label>
                        <textarea id="description" name="description" value={editForm.description} onChange={handleEditChange} rows={4} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>{t('categories')}</label>
                        {categoriesLoading ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            <div className={styles.categoriesGrid}>
                                {categories.map((category) => (
                                    <button key={category.id} type="button" className={`${styles.categoryBtn} ${selectedCategories.includes(category.id) ? styles.active : ''}`} onClick={() => handleCategoryToggle(category.id)}>
                                        {getCategoryDisplayName(category.category, t)}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {selectedCategories.length > 0 && (
                            <p className={styles.selectedInfo}>{selectedCategories.length} {t('categoriesSelected')}</p>
                        )}
                    </div>

                    <div className={styles.mapSection}>
                        <label>{t('clickOnMapToUpdateLocation')}</label>
                        <div className={styles.mapContainer}>
                            <MapWithNoSSR onLocationSelect={handleMapLocationSelect} initialPosition={listing?.latitude && listing?.longitude ? [listing.latitude, listing.longitude] : null} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>{t('latitude')}</label>
                            <input type="text" value={editForm.latitude} readOnly />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('longitude')}</label>
                            <input type="text" value={editForm.longitude} readOnly />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="photos">
                            {listing?.workType === 'ONLINE' ? t('editServiceForm.newPhotosOptionalOnline') : t('editServiceForm.newPhotosOptionalInPerson')}
                        </label>
                        
                        <input type="file" id="photos" accept="image/*" multiple onChange={handlePhotoChange} />
                        {newPhotos.length > 0 && (
                            <p className={styles.fileInfo}>{newPhotos.length} {t('photosSelected')}</p>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>{t('cancel')}</button>
                        <button type="submit" className={styles.saveButton} disabled={saving}> {saving ? t('saving') : t('saveChanges')}</button>
                    </div>
                </form>
                
            ) : (
                <div className={styles.listingView}>
                    
                    <div className={styles.sellerBar}>

                        <Link href={`/profile/${listing.seller?.id}`} className={styles.sellerInfo}>
                            <img src={listing.seller?.profilePhoto?.url ? `${BACKEND_URL}${listing.seller.profilePhoto.url}` : '/profile.png'} alt={`${listing.seller?.firstName} ${listing.seller?.lastName}`} className={styles.sellerPfp} />
                            <span className={styles.sellerName}>
                                {listing.seller?.firstName} {listing.seller?.lastName}
                            </span>
                        </Link>
                        
                        <div className={styles.serviceTags}>
                            {!isOwner && (
                                <>
                                <button onClick={() => router.push(`/dashboard/messages?userId=${listing.seller?.id}&listingId=${listing.listingId}`)} className={styles.messageIconButton} title={t('messageSeller')}>
                                        <MessageCircle size={18} />
                                </button>

                                <button className={styles.messageIconButton} title={t('viewRequirements')} onClick={writeReview}>
                                    <UserStar size={18} />
                                </button>
                                </>
                            )}
                            
                            {listing.categories && listing.categories.map((category) => (
                                <span key={category.id} className={styles.categoryTag}>
                                    {getCategoryDisplayName(category.category, t)}
                                </span>
                            ))}
                            <span className={`${styles.workTypeTag} ${styles[listing.workType?.toLowerCase()]}`}>
                                {listing.workType === 'ONLINE' ? 'Online' : 'In Person'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.mainContent}>
                        <div className={styles.leftColumn}>
                            <div className={styles.imageSection}>
                                {listing.photos.map((photo, index) => (
                                    <div key={index} className={styles.photoContainer}>
                                        <img src={`${BACKEND_URL}${photo.url}`} alt={photo.altText} className={styles.photo} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <h1 className={styles.serviceTitle}>{listing.name}</h1>
                            <p className={styles.description}>{listing.description}</p>
                            <ReviewsSection reviews={listing.reviews} backendUrl={BACKEND_URL} t={t} currentUser={currentUser} onReviewUpdated={(updatedReview) => updateReviewInListing(setListing, updatedReview)} onReviewDeleted={(reviewId) => removeReviewFromListing(setListing, reviewId)} />
                        </div>

                        {Boolean(listing.latitude) && Boolean(listing.longitude) && (
                            <div className={styles.mapSection}>
                                <label className={styles.mapLabel}>{t('serviceLocation')}</label>
                                <div className={styles.mapContainerDisplay}>
                                    <MapContainer center={[listing.latitude, listing.longitude]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
                                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[listing.latitude, listing.longitude]} icon={getDefaultIcon()} />
                                    </MapContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ReviewModal isOpen={review} onClose={closeReview} onSubmit={handleReviewSubmit} formData={reviewForm} onChange={handleReviewChange} submitting={submittingReview} t={t} />

        </div>
    )
}
