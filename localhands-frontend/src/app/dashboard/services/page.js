"use client"

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import CreateServiceForm from '@/components/CreateServiceForm/CreateServiceForm'
import SearchBar from '@/components/searchBar/SearchBar'
import ListingCard from '@/components/ListingCard/ListingCard'
import { getListingsWithinRadius } from '@/api/listingApi'
import { getUserInfo } from '@/api/userApi'

// Convert miles to meters for API
const milesToMeters = (miles) => Math.round(miles * 1609.34)

export default function ServicesPage() {
    const [location, setLocation] = useState(null)
    const [nearbyListings, setNearbyListings] = useState([])
    const [listingsLoading, setListingsLoading] = useState(false)
    const [radius, setRadius] = useState(50) // in miles
    const [currentUser, setCurrentUser] = useState(null)

    // Get user info and location on mount
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


    // Fetch nearby listings when location or radius changes
    useEffect(() => {
        if (!location) return

        const fetchNearbyListings = async () => {
            setListingsLoading(true)
            try {
                const radiusInMeters = milesToMeters(radius)
                const listings = await getListingsWithinRadius(
                    location.latitude,
                    location.longitude,
                    radiusInMeters
                )
                setNearbyListings(listings)
            } catch (error) {
                console.error('Failed to fetch nearby listings:', error)
            } finally {
                setListingsLoading(false)
            }
        }

        fetchNearbyListings()
    }, [location, radius])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Services</h1>
                <p>Post your services here, or view services on offer!</p>
            </div>

            <div className={styles.midPage}>
                <SearchBar radius={radius} onRadiusChange={setRadius} />
                {currentUser?.roles?.includes("SELLER") && <CreateServiceForm />}
            </div>

            <div className={styles.nearbySection}>
                <h2>Nearby Services</h2>
                {listingsLoading ? (
                    <p className={styles.loadingText}>Loading nearby services...</p>
                ) : nearbyListings.length === 0 ? (
                    <p className={styles.noListingsText}>
                        There are currently no listings available in your area, either increase your search radius or check for online work.
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
