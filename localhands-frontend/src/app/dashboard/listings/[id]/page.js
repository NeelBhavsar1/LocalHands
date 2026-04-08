"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import { getListingById, updateListing, deleteListing } from '@/api/listingApi'
import { getUserInfo } from '@/api/userApi'

const MapWithNoSSR = dynamic(
  () => import('@/components/LocationPicker/LocationPicker'),
  { ssr: false }
)

export default function ListingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const listingId = params.id

    const [listing, setListing] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        latitude: '',
        longitude: ''
    })
    const [newPhotos, setNewPhotos] = useState([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingData, userData] = await Promise.all([
                    getListingById(listingId),
                    getUserInfo()
                ])
                setListing(listingData)
                setCurrentUser(userData)
                setEditForm({
                    name: listingData.name,
                    description: listingData.description,
                    latitude: listingData.latitude,
                    longitude: listingData.longitude
                })
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

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files)
        setNewPhotos(files)
    }

    const handleMapLocationSelect = (lat, lng) => {
        setEditForm(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
        }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        
        if (newPhotos.length === 0) {
            alert('Please select at least one photo')
            return
        }

        setSaving(true)
        try {
            const altTexts = newPhotos.map((_, index) => `Photo ${index + 1} of ${editForm.name}`)
            
            const listingData = {
                name: editForm.name,
                description: editForm.description,
                latitude: parseFloat(editForm.latitude),
                longitude: parseFloat(editForm.longitude)
            }

            const updated = await updateListing(listingId, listingData, newPhotos, altTexts)
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
        return <div className={styles.container}>Loading...</div>
    }

    if (!listing) {
        return <div className={styles.container}>Listing not found</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button 
                    onClick={() => router.push('/dashboard')}
                    className={styles.backButton}
                >
                    ← Back to Dashboard
                </button>
                
                {isOwner && !isEditing && (
                    <div className={styles.actions}>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className={styles.editButton}
                        >
                            Edit Listing
                        </button>
                        <button 
                            onClick={handleDelete}
                            className={styles.deleteButton}
                        >
                            Delete Listing
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate} className={styles.editForm}>
                    <h2>Edit Listing</h2>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Service Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            rows={4}
                            required
                        />
                    </div>

                    <div className={styles.mapSection}>
                        <label>Click on the map to update location</label>
                        <div className={styles.mapContainer}>
                            <MapWithNoSSR onLocationSelect={handleMapLocationSelect} />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Latitude</label>
                            <input type="text" value={editForm.latitude} readOnly />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Longitude</label>
                            <input type="text" value={editForm.longitude} readOnly />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="photos">New Photos (required)</label>
                        <input
                            type="file"
                            id="photos"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoChange}
                            required
                        />
                        {newPhotos.length > 0 && (
                            <p className={styles.fileInfo}>{newPhotos.length} photo(s) selected</p>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={styles.saveButton}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className={styles.listingView}>
                    <div className={styles.photosGrid}>
                        {listing.photos.map((photo, index) => (
                            <div key={index} className={styles.photoContainer}>
                                <Image
                                    src={photo.url}
                                    alt={photo.altText}
                                    fill
                                    className={styles.photo}
                                />
                            </div>
                        ))}
                    </div>

                    <div className={styles.details}>
                        <h1>{listing.name}</h1>
                        <p className={styles.description}>{listing.description}</p>
                        
                        <div className={styles.meta}>
                            <span className={styles.location}>
                                📍 {listing.latitude?.toFixed(4)}, {listing.longitude?.toFixed(4)}
                            </span>
                            <span className={styles.date}>
                                Posted: {new Date(listing.creationTime).toLocaleDateString()}
                            </span>
                            <span className={styles.seller}>
                                By: {listing.seller?.firstName} {listing.seller?.lastName}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
