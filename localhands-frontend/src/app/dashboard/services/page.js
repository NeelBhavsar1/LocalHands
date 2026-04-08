"use client"

import { useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import { createListing } from '@/api/listingApi'
import { createServiceChangeHandler, createServicePhotoHandler, createMapLocationHandler, createWorkTypeHandler, validateServiceForm, generateAltTexts, resetServiceForm } from '@/utils/listingUtils'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'

// Dynamically import the map component to avoid SSR issues
// This is necessary because the map component uses window object which is not available on the server
const MapWithNoSSR = dynamic(
  () => import('@/components/LocationPicker/LocationPicker'),
  { ssr: false }
)

export default function page() {
    const [showForm, setShowForm] = useState(false)
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(false)
    const [workType, setWorkType] = useState('online')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        latitude: '',
        longitude: ''
    })

    const handleChange = createServiceChangeHandler(setFormData)
    const handlePhotoChange = createServicePhotoHandler(setPhotos)
    const handleMapLocationSelect = createMapLocationHandler(setFormData)
    const handleWorkTypeChange = createWorkTypeHandler(setWorkType, setFormData)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const validation = validateServiceForm(formData, photos, workType)
        if (!validation.valid) {
            alert(validation.error)
            return
        }
        
        setLoading(true)

        try {
            const altTexts = generateAltTexts(photos, formData.name)
            await createListing(validation.data, photos, altTexts)
            alert('Service created successfully!')
            resetServiceForm(setFormData, setPhotos, setWorkType, setShowForm)
        } catch (error) {
            alert('Error creating service: ' + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Services</h1>
                <p>Post your services here, or view services on offer!</p>
            </div>

            <div className={styles.actions}>
                <button onClick={() => setShowForm(!showForm)} className={styles.createButton}>
                    {showForm ? 'Cancel' : 'Create Service'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2>Create New Service</h2>
                    
                    <div className={styles.formGroup}>
                        <label>Work Type *</label>
                        <div className={styles.workTypeButtons}>
                            <button type="button" className={`${styles.workTypeBtn} ${workType === 'online' ? styles.active : ''}`} onClick={() => handleWorkTypeChange('online')}>Online</button>
                            <button type="button" className={`${styles.workTypeBtn} ${workType === 'in-person' ? styles.active : ''}`} onClick={() => handleWorkTypeChange('in-person')}>In-Person</button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">Service Name *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description *</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
                    </div>

                    {workType === 'in-person' && (
                        <>
                            <div className={styles.mapSection}>
                                <label>Click on the map to set location *</label>
                                <div className={styles.mapContainer}>
                                    <MapWithNoSSR onLocationSelect={handleMapLocationSelect} />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="latitude">Latitude</label>
                                    <input type="number" step="any" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Click map to set" readOnly />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="longitude">Longitude</label>
                                    <input type="number" step="any" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Click map to set" readOnly />
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="photos">Photos *</label>
                        <input type="file" id="photos" name="photos" accept="image/*" multiple onChange={handlePhotoChange} required />
                        {photos.length > 0 && (
                            <p className={styles.fileInfo}>{photos.length} photo(s) selected</p>
                        )}
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Create Service'}
                    </button>
                </form>
            )}
        </div>
    )
}