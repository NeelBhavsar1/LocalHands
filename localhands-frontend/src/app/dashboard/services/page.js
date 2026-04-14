"use client"

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import CreateServiceForm from '@/components/CreateServiceForm/CreateServiceForm'
import SearchBar from '@/components/searchBar/SearchBar'
import ListingCard from '@/components/ListingCard/ListingCard'
import { searchListings } from '@/api/listingApi'
import { getUserInfo } from '@/api/userApi'

// Convert miles to meters for API
const milesToMeters = (miles) => Math.round(miles * 1609.34)

//1.5s delay for aws
const DEBOUNCE_DELAY = 1500 

export default function ServicesPage() {
    const [location, setLocation] = useState(null)
    const [nearbyListings, setNearbyListings] = useState([])
    const [listingsLoading, setListingsLoading] = useState(false)
    const [radius, setRadius] = useState(50) // in miles
    const [selectedCategories, setSelectedCategories] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [workType, setWorkType] = useState('BOTH')
    const [currentUser, setCurrentUser] = useState(null)

    /**
     * This hook fetches the current user info and gets the user's location on mount.
     */
    useEffect(() => {
        // Fetch current user info
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserInfo()
                setCurrentUser(userData)
            } catch (error) {
                console.error('Failed to fetch user info:', error)
            }
        }
        fetchUserInfo()

        // Get location
        if (!navigator.geolocation) return

        // Get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude
                const lon = position.coords.longitude
                setLocation({ latitude: lat, longitude: lon })
            },
            (error) => {
                console.error('Geolocation error:', error)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }, [])

    //debounce search query changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, DEBOUNCE_DELAY)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch listings when filters change (using debounced search query)
    useEffect(() => {
        const fetchListings = async () => {
            setListingsLoading(true)
            try {
                const radiusInMeters = milesToMeters(radius)

                const effectiveWorkType = location ? workType : 'ONLINE'
                const listings = await searchListings(
                    debouncedSearchQuery,
                    location?.latitude,
                    location?.longitude,
                    selectedCategories,
                    effectiveWorkType,
                    radiusInMeters
                )

                setNearbyListings(listings)
            } catch (error) {
                console.error('Failed to fetch listings:', error)
            } finally {
                setListingsLoading(false)
            }
        }

        fetchListings()
    }, [location, radius, selectedCategories, debouncedSearchQuery, workType, currentUser])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Services</h1>
                <p>Post your services here, or view services on offer!</p>
            </div>

            <div className={styles.midPage}>
                <SearchBar radius={radius} onRadiusChange={setRadius} onCategoriesChange={setSelectedCategories} searchQuery={searchQuery} onSearchChange={setSearchQuery} workType={workType} onWorkTypeChange={setWorkType} hasLocation={!!location} />
                {currentUser?.roles?.includes("SELLER") && <CreateServiceForm />}
            </div>

            <div className={styles.nearbySection}>
                <h2>{debouncedSearchQuery ? `Search Results for "${debouncedSearchQuery}"` : location ? 'Nearby Services' : 'Online Services'}</h2>
                {listingsLoading ? (
                    <p className={styles.loadingText}>{location ? 'Loading nearby services...' : 'Loading online services...'}</p>
                ) : nearbyListings.length === 0 ? (
                    <p className={styles.noListingsText}>
                        {location ? 'There are currently no listings available in your area, either increase your search radius or check for online work.': 'There are currently no online listings available. Please enable location access to see services in your area.'}
                    </p>
                ) : (
                    <div className={styles.listingsGrid}>
                        {nearbyListings.map((listing) => (
                            <ListingCard key={listing.listingId} listing={listing} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
