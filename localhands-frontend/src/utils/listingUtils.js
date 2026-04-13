// Backend URL for image loading
export const BACKEND_URL = 'http://localhost:8080';

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

export const validateListingForm = (editForm, newPhotos, selectedCategories, workType = 'ONLINE', isEdit = false) => {
    //photos are optional when editingonly validate required photos for new listings
    if (!isEdit && (!newPhotos || newPhotos.length === 0)) {
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

//categoru name mapping
export const CATEGORY_NAME_MAP = {
    'CLEANING': 'Cleaning',
    'PLUMBING': 'Plumbing',
    'ELECTRICAL': 'Electrical',
    'GARDENING': 'Gardening',
    'PAINTING': 'Painting',
    'CARPENTRY': 'Carpentry',
    'HANDYMAN': 'Handyman',
    'MOVING': 'Moving',
    'DELIVERY': 'Delivery',
    'HEAVY_LIFTING': 'Heavy Lifting',
    'TUTORING': 'Tutoring',
    'IT_SUPPORT': 'IT Support',
    'TECH_SETUP': 'Tech Setup',
    'PET_CARE': 'Pet Care',
    'BABYSITTING': 'Babysitting',
    'CAR_WASH': 'Car Wash',
    'CAR_REPAIR': 'Car Repair',
    'BEAUTY': 'Beauty',
    'HAIRDRESSING': 'Hairdressing',
    'PHOTOGRAPHY': 'Photography',
    'VIDEOGRAPHY': 'Videography',
    'FITNESS_TRAINING': 'Fitness Training',
    'EVENT_HELP': 'Event Help',
    'CATERING': 'Catering',
    'HOME_REPAIR': 'Home Repair',
    'APPLIANCE_REPAIR': 'Appliance Repair',
    'OTHER': 'Other'
};

//helper function to get human readable category name
export const getCategoryDisplayName = (categoryName) => {
    return CATEGORY_NAME_MAP[categoryName] || categoryName?.replace(/_/g, ' ')
};

//review form change handler creator
export const createReviewChangeHandler = (setReviewForm) => (e) => {
    const { name, value } = e.target
    setReviewForm(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }))
}

//submits review to backend
export const submitReview = async (backendUrl, listingId, reviewForm) => {
    const response = await fetch(`${backendUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            listingId: parseInt(listingId),
            rating: reviewForm.rating,
            reviewBody: reviewForm.reviewBody
        })
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit review')
    }

    return await response.json()
}

//category toggle handler creator
export const createCategoryToggleHandler = (setSelectedCategories) => (categoryId) => {
    setSelectedCategories(prev => {
        if (prev.includes(categoryId)) {
            return prev.filter(id => id !== categoryId)
        } else {
            return [...prev, categoryId]
        }
    })
}

//update review in listing state
export const updateReviewInListing = (setListing, updatedReview) => {
    setListing(prev => ({ ...prev, reviews: prev.reviews.map(r => r.id === updatedReview.id ? updatedReview : r) }))
}

//remove review from listing state
export const removeReviewFromListing = (setListing, reviewId) => {
    setListing(prev => ({ ...prev, reviews: prev.reviews.filter(r => r.id !== reviewId) }))
}
