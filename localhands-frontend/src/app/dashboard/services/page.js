"use client"

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import CreateServiceForm from '@/components/CreateServiceForm/CreateServiceForm'
import SearchBar from '@/components/searchBar/SearchBar'
import ListingCard from '@/components/ListingCard/ListingCard'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { getListingsWithinRadius } from '@/api/listingApi'

const LOADING_TIMEOUT = 10000 // 10 seconds

// Convert miles to meters for API
const milesToMeters = (miles) => Math.round(miles * 1609.34)

export default function ServicesPage() {
    const [location, setLocation] = useState(null)
    const [nearbyListings, setNearbyListings] = useState([])
    const [listingsLoading, setListingsLoading] = useState(false)
    const [loadingTimedOut, setLoadingTimedOut] = useState(false)
    const [radius, setRadius] = useState(50) // in miles

    // Get user location on mount
    useEffect(() => {
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

    // Timeout effect - shows message after 10 seconds if still loading
    useEffect(() => {
        if (!listingsLoading) {
            setLoadingTimedOut(false)
            return
        }

        const timer = setTimeout(() => {
            setLoadingTimedOut(true)
        }, LOADING_TIMEOUT)

        return () => clearTimeout(timer)
    }, [listingsLoading])

    // Fetch nearby listings when location or radius changes
    useEffect(() => {
        if (!location) return

        const fetchNearbyListings = async () => {
            setListingsLoading(true)
            setLoadingTimedOut(false)
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
                <CreateServiceForm />
            </div>

            <div className={styles.nearbySection}>
                <h2>Nearby Services</h2>
                {listingsLoading && !loadingTimedOut ? ( <LoadingSpinner /> ) : nearbyListings.length === 0 ? 
                (
                    <>
                        {loadingTimedOut && <LoadingSpinner />}
                        <p className={styles.noListingsText}>
                            There are currently no listings available in your area, either increase your search radius
                        </p>
                    </>
                ) : 
                (
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
