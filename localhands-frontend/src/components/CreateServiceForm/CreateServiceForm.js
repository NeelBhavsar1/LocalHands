"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import styles from './CreateServiceForm.module.css'
import { createListing, getCategories } from '@/api/listingApi'
import { createServiceChangeHandler, createServicePhotoHandler, createMapLocationHandler, createWorkTypeHandler, validateServiceForm, generateAltTexts, resetServiceForm, getCategoryDisplayName } from '@/utils/listingUtils'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { useTranslation } from 'react-i18next'

// Dynamically import the map component to avoid SSR issues
// This is necessary because the map component uses window object which is not available on the server
const MapWithNoSSR = dynamic(
  () => import('@/components/LocationPicker/LocationPicker'),
  { ssr: false }
)

export default function CreateServiceForm({ onSuccess }) {
    const [showForm, setShowForm] = useState(false)
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(false)
    const [workType, setWorkType] = useState('online')
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        latitude: '',
        longitude: ''
    })

    //fetches categories when form is shown
    useEffect(() => {
        if (showForm) {
            const fetchCategories = async () => {
                setCategoriesLoading(true)
                try {
                    const data = await getCategories()
                    setCategories(data)
                } catch (error) {
                    console.error('Failed to fetch categories:', error)
                } finally {
                    setCategoriesLoading(false)
                }
            }
            fetchCategories()
        }
    }, [showForm])

    const handleChange = createServiceChangeHandler(setFormData)
    const handlePhotoChange = createServicePhotoHandler(setPhotos)
    const handleMapLocationSelect = createMapLocationHandler(setFormData)
    const handleWorkTypeChange = createWorkTypeHandler(setWorkType, setFormData)

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId)
            } else {
                return [...prev, categoryId]
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const validation = validateServiceForm(formData, photos, workType, selectedCategories)
        if (!validation.valid) {
            alert(validation.error)
            return
        }
        
        setLoading(true)

        try {
            const altTexts = generateAltTexts(photos, formData.name)
            await createListing(validation.data, photos, altTexts)
            alert('Service created successfully!')
            resetServiceForm(setFormData, setPhotos, setWorkType, setShowForm, setSelectedCategories)
            onSuccess?.()
        } catch (error) {
            alert('Error creating service: ' + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <button onClick={() => setShowForm(!showForm)} className={styles.createButton}>
                {showForm ? 'Cancel' : '+'}
            </button>

            {showForm && (
                <div className={styles.overlay} onClick={() => setShowForm(false)}>
                    <form onSubmit={handleSubmit} className={styles.form} onClick={(e) => e.stopPropagation()}>
                    <h2>{t('createServiceForm.title')}</h2>
                    
                    <div className={styles.formGroup}>
                        <label>{t('createServiceForm.workType')}</label>
                        <div className={styles.workTypeButtons}>
                            <button type="button" className={`${styles.workTypeBtn} ${workType === 'online' ? styles.active : ''}`} onClick={() => handleWorkTypeChange('online')}>{t('createServiceForm.online')}</button>
                            <button type="button" className={`${styles.workTypeBtn} ${workType === 'in-person' ? styles.active : ''}`} onClick={() => handleWorkTypeChange('in-person')}>{t('createServiceForm.inPerson')}</button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">{t('createServiceForm.serviceName')} *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">{t('createServiceForm.description')} *</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>{t('createServiceForm.categories')} *</label>
                        {categoriesLoading ? (

                            <LoadingSpinner />
                        ) : (
                            <div className={styles.categoriesGrid}>
                                {categories.map((category) => (
                                    <button key={category.id} type="button" className={`${styles.categoryBtn} ${selectedCategories.includes(category.id) ? styles.active : ''}`} onClick={() => handleCategoryToggle(category.id)}>
                                        {getCategoryDisplayName(category.category)}
                                    </button>
                                ))}
                            </div>
                        )}

                        {selectedCategories.length > 0 && (
                            <p className={styles.selectedInfo}>{selectedCategories.length} category(s) selected</p>
                        )}
                    </div>

                    {workType === 'in-person' && (
                        <>
                            <div className={styles.mapSection}>
                                <label>{t('createServiceForm.clickMapToSetLocation')} *</label>
                                <div className={styles.mapContainer}>
                                    <MapWithNoSSR onLocationSelect={handleMapLocationSelect} />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="latitude">{t('createServiceForm.latitude')}</label>
                                    <input type="number" step="any" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} placeholder={t('createServiceForm.clickMapToSetLocation')} readOnly />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="longitude">{t('createServiceForm.longitude')}</label>
                                    <input type="number" step="any" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} placeholder={t('createServiceForm.clickMapToSetLocation')} readOnly />
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="photos">{t('createServiceForm.photos')} *</label>
                        <input type="file" id="photos" name="photos" accept="image/*" multiple onChange={handlePhotoChange} required />
                        {photos.length > 0 && (
                            <p className={styles.fileInfo}>{photos.length} {t('createServiceForm.photosSelected')}</p>
                        )}
                    </div>      

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? <LoadingSpinner /> : t('createServiceForm.createService')}
                    </button>
                    </form>
                </div>
            )}
        </div>
    )
}
