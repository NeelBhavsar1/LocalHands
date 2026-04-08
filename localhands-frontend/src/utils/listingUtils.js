import L from 'leaflet'

// Backend URL configuration for API calls
// needed because of vercel deployment
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

// Leaflet default icon configuration for map markers
// check yt video for this
export const DefaultIcon = L.icon({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

/**
 * Creates a change handler for form inputs
 * @param {*} setEditForm - The setter function for edit form data
 * @returns {Function} - A change handler function
 */
export const createEditChangeHandler = (setEditForm) => (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
}

/**
 * Creates a change handler for photo inputs
 * @param {*} setNewPhotos - The setter function for new photos
 * @returns {Function} - A change handler function
 */
export const createPhotoChangeHandler = (setNewPhotos) => (e) => {
    const files = Array.from(e.target.files)
    setNewPhotos(files)
}

/**
 * Creates a location handler for map clicks
 * @param {*} setEditForm - The setter function for edit form data
 * @returns {Function} - A location handler function
 */
export const createMapLocationHandler = (setEditForm) => (lat, lng) => {
    setEditForm(prev => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
    }))
}

/**
 * Validates listing form data
 * @param {*} editForm - The edit form data
 * @param {*} newPhotos - The new photos array
 * @returns {Object} - Validation result with valid flag and error message
 */
export const validateListingForm = (editForm, newPhotos) => {
    if (newPhotos.length === 0) {
        return { valid: false, error: 'Please select at least one photo' }
    }

    const lat = parseFloat(editForm.latitude)
    const lng = parseFloat(editForm.longitude)

    if (isNaN(lat) || isNaN(lng)) {
        return { valid: false, error: 'Please select a location on the map' }
    }

    return {
        valid: true,
        data: {
            name: editForm.name,
            description: editForm.description,
            latitude: lat,
            longitude: lng
        }
    }
}

/**
 * Generates alt texts for photos
 * @param {*} photos - The photos array
 * @param {*} listingName - The listing name
 * @returns {Array} - Array of alt texts
 */
export const generateAltTexts = (photos, listingName) => {
    return photos.map((_, index) => `Photo ${index + 1} of ${listingName}`)
}

/**
 * Creates a change handler for service form inputs
 * @param {*} setFormData - The setter function for form data
 * @returns {Function} - A change handler function
 */
export const createServiceChangeHandler = (setFormData) => (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
}

/**
 * Creates a photo handler for service form inputs
 * @param {*} setPhotos - The setter function for photos
 * @returns {Function} - A photo handler function
 */
export const createServicePhotoHandler = (setPhotos) => (e) => {
    const files = Array.from(e.target.files)
    setPhotos(files)
}

/**
 * Creates a work type handler for service form inputs
 * @param {*} setWorkType - The setter function for work type
 * @param {*} setFormData - The setter function for form data
 * @returns {Function} - A work type handler function
 */
export const createWorkTypeHandler = (setWorkType, setFormData) => (type) => {
    setWorkType(type)
    if (type === 'online') {
        setFormData(prev => ({ ...prev, latitude: '', longitude: '' }))
    }
}

/**
 * Validates service form data
 * @param {*} formData - The form data
 * @param {*} photos - The photos array
 * @param {*} workType - The work type
 * @returns {Object} - Validation result with valid flag and error message
 */
export const validateServiceForm = (formData, photos, workType) => {
    if (photos.length === 0) {
        return { valid: false, error: 'Please add at least one photo' }
    }

    if (workType === 'in-person' && (!formData.latitude || !formData.longitude)) {
        return { valid: false, error: 'Please select a location on the map for in-person work' }
    }

    return {
        valid: true,
        data: {
            name: formData.name,
            description: formData.description,
            latitude: workType === 'online' ? 0 : parseFloat(formData.latitude),
            longitude: workType === 'online' ? 0 : parseFloat(formData.longitude)
        }
    }
}

/**
 * Resets service form
 * @param {*} setFormData - The setter function for form data
 * @param {*} setPhotos - The setter function for photos
 * @param {*} setWorkType - The setter function for work type
 * @param {*} setShowForm - The setter function for show form
 */
export const resetServiceForm = (setFormData, setPhotos, setWorkType, setShowForm) => {
    setFormData({ name: '', description: '', latitude: '', longitude: '' })
    setPhotos([])
    setWorkType('online')
    setShowForm(false)
}
