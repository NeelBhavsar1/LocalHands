"use client"

import { useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import { createListing } from '@/api/listingApi'

// Dynamically import map component to avoid SSR issues
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

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files)
        setPhotos(files)
    }

    const handleMapLocationSelect = (lat, lng) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
        }))
    }

    const handleWorkTypeChange = (type) => {
        setWorkType(type)
        if (type === 'online') {
            setFormData(prev => ({ ...prev, latitude: '', longitude: '' }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (photos.length === 0) {
            alert('Please add at least one photo')
            return
        }
        
        if (workType === 'in-person' && (!formData.latitude || !formData.longitude)) {
            alert('Please select a location on the map for in-person work')
            return
        }
        
        setLoading(true)

        try {
            const altTexts = photos.map((_, index) => `Photo ${index + 1} of ${formData.name}`)
            
            const listingData = {
                name: formData.name,
                description: formData.description,
                latitude: workType === 'online' ? 0 : parseFloat(formData.latitude),
                longitude: workType === 'online' ? 0 : parseFloat(formData.longitude)
            }

            await createListing(listingData, photos, altTexts)
            alert('Service created successfully!')
            
            setFormData({ name: '', description: '', latitude: '', longitude: '' })
            setPhotos([])
            setWorkType('online')
            setShowForm(false)
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
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className={styles.createButton}
                >
                    {showForm ? 'Cancel' : 'Create Service'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2>Create New Service</h2>
                    
                    <div className={styles.formGroup}>
                        <label>Work Type *</label>
                        <div className={styles.workTypeButtons}>
                            <button
                                type="button"
                                className={`${styles.workTypeBtn} ${workType === 'online' ? styles.active : ''}`}
                                onClick={() => handleWorkTypeChange('online')}
                            >
                                Online
                            </button>
                            <button
                                type="button"
                                className={`${styles.workTypeBtn} ${workType === 'in-person' ? styles.active : ''}`}
                                onClick={() => handleWorkTypeChange('in-person')}
                            >
                                In-Person
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">Service Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                        />
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
                                    <input
                                        type="number"
                                        step="any"
                                        id="latitude"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        placeholder="Click map to set"
                                        readOnly
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="longitude">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        id="longitude"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        placeholder="Click map to set"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="photos">Photos *</label>
                        <input
                            type="file"
                            id="photos"
                            name="photos"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoChange}
                            required
                        />
                        {photos.length > 0 && (
                            <p className={styles.fileInfo}>{photos.length} photo(s) selected</p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Service'}
                    </button>
                </form>
            )}
        </div>
    )
}