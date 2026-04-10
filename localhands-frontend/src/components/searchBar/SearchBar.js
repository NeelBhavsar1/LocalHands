"use client"

import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import styles from './searchBar.module.css';

export default function SearchBar({ radius, onRadiusChange }) {
    const [workType, setWorkType] = useState('all');

    

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Search className={styles.icon} size={20} />
                <input type="text" className={styles.input} placeholder="Search services..." />
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <MapPin size={16} />
                    <label htmlFor="radius">Radius:</label>
                    <select id="radius" className={styles.select} value={radius} onChange={(e) => onRadiusChange?.(Number(e.target.value))}>
                        <option value={5}>5 miles</option>
                        <option value={10}>10 miles</option>
                        <option value={25}>25 miles</option>
                        <option value={50}>50 miles</option>
                        <option value={100}>100 miles</option>
                        <option value={150}>150 miles</option>
                        <option value={200}>200 miles</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Work Type:</label>
                    <div className={styles.workTypeFilter}>
                        <button className={`${styles.filterBtn} ${workType === 'all' ? styles.active : ''}`} >
                            All
                        </button>
                        <button className={`${styles.filterBtn} ${workType === 'online' ? styles.active : ''}`} >
                            Online
                        </button>
                        <button className={`${styles.filterBtn} ${workType === 'in-person' ? styles.active : ''}`} >
                            In-Person
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}