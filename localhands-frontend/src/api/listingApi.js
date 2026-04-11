import api from "./api";

/**
 * Creates a new listing with associated photos and accessibility test
 * @param {*} listingData - The listing data to create
 * @param {*} photos - The photos to upload
 * @param {*} altTexts - The alt texts for the photos
 * @returns 
 */
export const createListing = async (listingData, photos, altTexts) => {
    try {
        // DEBUG: Log exactly what we're sending
        console.log("=== CREATE LISTING DEBUG ===");
        console.log("listingData:", JSON.stringify(listingData, null, 2));
        console.log("listingData.categoryIds:", listingData.categoryIds);
        console.log("listingData.categoryIds types:", listingData.categoryIds?.map(id => `${id} (${typeof id})`));
        console.log("listingData.workType:", listingData.workType, `(typeof: ${typeof listingData.workType})`);
        console.log("listingData.latitude:", listingData.latitude, `(typeof: ${typeof listingData.latitude})`);
        console.log("listingData.longitude:", listingData.longitude, `(typeof: ${typeof listingData.longitude})`);
        console.log("photos count:", photos?.length);
        console.log("altTexts:", altTexts);
        console.log("photos.length === altTexts.length:", photos?.length === altTexts?.length);
        console.log("===========================");

        const formData = new FormData();
        
        // Add listing as JSON blob
        const listingBlob = new Blob([JSON.stringify(listingData)], { type: 'application/json' });
        formData.append('listing', listingBlob);
        
        // Add photos
        photos.forEach((photo) => {
            formData.append('photos', photo);
        });
        
        // Build altTexts as query params
        const altTextsParams = altTexts.map(text => `altTexts=${encodeURIComponent(text)}`).join('&');
        
        const res = await api.post(`/api/listings?${altTextsParams}`, formData, {
            headers: { 'Content-Type': undefined }
        });
        
        return res.data;
    } catch (error) {
        console.error("Create listing error:", error);
        console.error("Error response:", error.response);
        console.error("Error data:", error.response?.data);
        throw error.response?.data || "Failed to create listing";
    }
}

/**
 * Gets all listings belonging to current user
 * @returns 
 */
export const getMyListings = async () => {
    try {
        const res = await api.get("/api/listings/me");
        return res.data
    } catch (error) {
        console.error("Get my listings error: ", error)
        throw error.response?.data || "Failed to fetch your listings!"
    }
}


/**
 * Gets a single listing by id
 * @param {*} listingId - The id of the listing to get
 * @returns 
 */
export const getListingById = async (listingId) => {
    try {
        const res = await api.get("/api/listings/id", {
            params: { listingId }
        })
        return res.data
    } catch (error) {
        console.error("Get listing error: ", error)
        throw error.response?.data || "Failed to fetch listing!"
    }
}

/**
 * Search listings by name with optional location and category filter
 * @param {*} searchInput - The search input
 * @param {*} latitude - The latitude of the location
 * @param {*} longitude - The longitude of the location
 * @param {*} categoryIds - Optional array of category IDs to filter by
 * @returns 
 */
export const searchListings = async (searchInput, latitude, longitude, categoryIds) => {
    try {
        const params = { searchInput };
        if (latitude && longitude) {
            params.latitude = latitude;
            params.longitude = longitude;
        }
        if (categoryIds && categoryIds.length > 0) {
            params.categoryIds = categoryIds.join(',');
        }
        
        const res = await api.get("/api/listings/search", { params })
        return res.data
    } catch (error) {
        console.error("Search listings error: ", error)
        throw error.response?.data || "Failed to search listings!"
    }
}

/**
 * Gets listings within radius of location with optional category filter
 * @param {*} latitude - The latitude of the location
 * @param {*} longitude - The longitude of the location
 * @param {*} radius - The radius in meters
 * @param {*} categoryIds - Optional array of category IDs to filter by
 * @param {*} workType - The work type ('ONLINE', 'IN_PERSON', or 'BOTH')
 * @returns 
 */
export const getListingsWithinRadius = async (latitude, longitude, radius, categoryIds, workType = 'BOTH') => {
    try {
        const params = { 
            searchInput: '',  // Empty search to get all listings in radius
            latitude, 
            longitude, 
            radius,
            workType
        };
        if (categoryIds && categoryIds.length > 0) {
            params.categoryIds = categoryIds;
        }
        const res = await api.get("/api/listings/search", { params })
        return res.data
    } catch (error) {
        console.error("Get listings by radius error: ", error)
        throw error.response?.data || "Failed to fetch nearby listings!"
    }
}

/**
 * Updates a listing
 * @param {*} listingId - The id of the listing to update
 * @param {*} listingData - The listing data to update
 * @param {*} photos - The photos to update
 * @param {*} altTexts - The alt texts for the photos
 * @returns 
 */
export const updateListing = async (listingId, listingData, photos, altTexts) => {
    try {
        const formData = new FormData();
        
        // Add listing as a Blob with JSON content type (same as createListing)
        const listingBlob = new Blob([JSON.stringify(listingData)], { 
            type: 'application/json' 
        })
        formData.append('listing', listingBlob)
        
        // Add photos if provided
        if (photos && photos.length > 0) {
            photos.forEach((photo) => {
                formData.append('photos', photo)
            })
        }
        
        // Build query params for altTexts - send as individual params
        const altTextsParams = altTexts?.map(text => `altTexts=${encodeURIComponent(text)}`).join('&');
        const queryParams = altTextsParams ? `&${altTextsParams}` : '';
        
        const res = await api.put(`/api/listings?listingId=${listingId}${queryParams}`, formData, {
            headers: {
                'Content-Type': undefined  // Let browser set multipart boundary
            },
        })
        
        return res.data
    } catch (error) {
        console.error("Update listing error: ", error)
        throw error.response?.data || "Failed to update listing!"
    }
}

/**
 * Deletes a listing
 * @param {*} listingId - The id of the listing to delete
 * @returns 
 */
export const deleteListing = async (listingId) => {
    try {
        const res = await api.delete("/api/listings", {
            params: { listingId }
        })

        return res.data
    } catch (error) {
        console.error("Delete listing error: ", error)
        throw error.response?.data || "Failed to delete listing!"
    }
}

/**
 * Gets all available categories
 * @returns {Array} - Array of category objects with id and category name
 */
export const getCategories = async () => {
    try {
        const res = await api.get("/api/listings/categories")
        return res.data
    } catch (error) {
        console.error("Get categories error: ", error)
        throw error.response?.data || "Failed to fetch categories!"
    }
}
