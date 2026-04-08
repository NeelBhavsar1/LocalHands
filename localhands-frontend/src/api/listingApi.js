import api from "./api";

//creates new listing with photos
export const createListing = async (listingData, photos, altTexts) => {
    try {
        const formData = new FormData();
        
        // Add listing as a Blob with JSON content type
        const listingBlob = new Blob([JSON.stringify(listingData)], { 
            type: 'application/json' 
        });
        formData.append('listing', listingBlob);
        
        // Add photos
        photos.forEach((photo) => {
            formData.append('photos', photo);
        });
        
        // Build query params for altTexts
        const altTextsParam = altTexts.map(text => encodeURIComponent(text)).join(',');
        
        const res = await api.post(`/api/listings?altTexts=${altTextsParam}`, formData, {
            headers: {
                'Content-Type': undefined  // Remove default JSON header
            },
        });
        
        return res.data;
    } catch (error) {
        console.error("Create listing error: ", error);
        throw error.response?.data || "Failed to create listing!";
    }
};

//gets all listings belonging to current user
export const getMyListings = async () => {
    try {
        const res = await api.get("/api/listings/me");
        return res.data;
    } catch (error) {
        console.error("Get my listings error: ", error);
        throw error.response?.data || "Failed to fetch your listings!";
    }
};

//gets a single listing by id
export const getListingById = async (listingId) => {
    try {
        const res = await api.get("/api/listings/id", {
            params: { listingId }
        });
        return res.data;
    } catch (error) {
        console.error("Get listing error: ", error);
        throw error.response?.data || "Failed to fetch listing!";
    }
};

//search listings by name with optional location
export const searchListings = async (searchInput, latitude, longitude) => {
    try {
        const params = { searchInput };
        if (latitude && longitude) {
            params.latitude = latitude;
            params.longitude = longitude;
        }
        
        const res = await api.get("/api/listings/search", { params });
        return res.data;
    } catch (error) {
        console.error("Search listings error: ", error);
        throw error.response?.data || "Failed to search listings!";
    }
};

//gets listings within radius of location
export const getListingsWithinRadius = async (latitude, longitude, radius) => {
    try {
        const res = await api.get("/api/listings/radius", {
            params: { latitude, longitude, radius }
        });
        return res.data;
    } catch (error) {
        console.error("Get listings by radius error: ", error);
        throw error.response?.data || "Failed to fetch nearby listings!";
    }
};

//updates a listing
export const updateListing = async (listingId, listingData) => {
    try {
        const formData = new FormData();
        
        formData.append('listing', JSON.stringify(listingData));
        
        const res = await api.put(`/api/listings?listingId=${listingId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return res.data;
    } catch (error) {
        console.error("Update listing error: ", error);
        throw error.response?.data || "Failed to update listing!";
    }
};

//deletes a listing
export const deleteListing = async (listingId) => {
    try {
        const res = await api.delete("/api/listings", {
            params: { listingId }
        });
        return res.data;
    } catch (error) {
        console.error("Delete listing error: ", error);
        throw error.response?.data || "Failed to delete listing!";
    }
};
