"use client"

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Create icon lazily to avoid SSR issues
const getDefaultIcon = () => {
    if (typeof window === 'undefined') return null
    const L = require('leaflet')
    return L.icon({
        iconUrl: '/marker-icon.png',
        iconRetinaUrl: '/marker-icon-2x.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
}

//this is a marker that shows the location on the map
function LocationMarker({ onLocationSelect, icon, initialPosition }) {
    const [position, setPosition] = useState(initialPosition)
    
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng
            setPosition([lat, lng])
            onLocationSelect(lat, lng)
        },
    })

    //sets initial pos on mount if it has been provided
    useEffect(() => {
        if (initialPosition && position === null) {
            setPosition(initialPosition)
        }
    }, [initialPosition])

    return (position === null || position === undefined) ? null : (
        <Marker position={position} icon={icon} />
    )
}

//this is the main component that shows the map and allows the user to select a location
export default function LocationPicker({ onLocationSelect, initialPosition }) {
    const defaultPosition = [53.4084, -2.9916]; // home of the champions
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div style={{ height: '300px', background: '#f0f0f0', borderRadius: '8px' }} />
    }

    const icon = getDefaultIcon()
    const center = initialPosition || defaultPosition

    return (
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '300px', width: '100%', borderRadius: '8px' }}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onLocationSelect={onLocationSelect} icon={icon} initialPosition={initialPosition} />
        </MapContainer>
    )
}
