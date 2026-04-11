// Backend URL for image loading
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// Leaflet icon for maps (lazy loaded for SSR compatibility)
export const getDefaultIcon = () => {
    if (typeof window === 'undefined') return null;
    const L = require('leaflet');
    return L.icon({
        iconUrl: '/marker-icon.png',
        iconRetinaUrl: '/marker-icon-2x.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

// Input change handler
export const createServiceChangeHandler = (setFormData) => (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

// Photo selection handler
export const createServicePhotoHandler = (setPhotos) => (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
};

// Work type change handler
export const createWorkTypeHandler = (setWorkType, setFormData) => (type) => {
    setWorkType(type);
    if (type === 'online') {
        setFormData(prev => ({ ...prev, latitude: '', longitude: '' }));
    }
};

// Validate create listing form
export const validateServiceForm = (formData, photos, workType, selectedCategories) => {
    if (!photos || photos.length === 0) {
        return { valid: false, error: 'Please add at least one photo' };
    }

    if (!selectedCategories || selectedCategories.length === 0) {
        return { valid: false, error: 'Please select at least one category' };
    }

    if (workType === 'in-person' && (!formData.latitude || !formData.longitude)) {
        return { valid: false, error: 'Please select a location on the map' };
    }

    // Convert frontend workType to backend enum
    const backendWorkType = workType === 'online' ? 'ONLINE' : 'IN_PERSON';

    // Ensure categoryIds are numbers (backend expects List<Long>)
    const categoryIds = selectedCategories.map(id => typeof id === 'string' ? parseInt(id, 10) : id);

    return {
        valid: true,
        data: {
            name: formData.name,
            description: formData.description,
            latitude: workType === 'online' ? 0 : parseFloat(formData.latitude),
            longitude: workType === 'online' ? 0 : parseFloat(formData.longitude),
            categoryIds: categoryIds,
            workType: backendWorkType
        }
    };
};

// Generate alt texts for photos
export const generateAltTexts = (photos, listingName) => {
    return photos.map((_, index) => `Photo ${index + 1} of ${listingName}`);
};

// Reset form state
export const resetServiceForm = (setFormData, setPhotos, setWorkType, setShowForm, setSelectedCategories) => {
    setFormData({ name: '', description: '', latitude: '', longitude: '' });
    setPhotos([]);
    setWorkType('online');
    setSelectedCategories && setSelectedCategories([]);
    setShowForm(false);
};

//edit page handlers
export const createEditChangeHandler = (setEditForm) => (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }))
};

export const createPhotoChangeHandler = (setNewPhotos) => (e) => {
    const files = Array.from(e.target.files)
    setNewPhotos(files)
};

export const createMapLocationHandler = (setEditForm) => (lat, lng) => {
    setEditForm(prev => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }))
};

export const validateListingForm = (editForm, newPhotos, selectedCategories, workType = 'ONLINE') => {
    if (!newPhotos || newPhotos.length === 0) {
        return { valid: false, error: 'Please select at least one photo' }
    }

    const lat = parseFloat(editForm.latitude);
    const lng = parseFloat(editForm.longitude);

    if (isNaN(lat) || isNaN(lng)) {
        return { valid: false, error: 'Please select a location on the map' }
    }

    //ensure categoryids are numbers
    const categoryIds = selectedCategories?.map(id => typeof id === 'string' ? parseInt(id, 10) : id) || [];

    return {
        valid: true,
        data: { name: editForm.name, description: editForm.description, latitude: lat, longitude: lng, categoryIds: categoryIds, workType: workType }
    }
};
