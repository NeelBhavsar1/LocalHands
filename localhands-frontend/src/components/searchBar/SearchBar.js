"use client"

import { useState, useEffect } from 'react';
import { Search, MapPin, Tag } from 'lucide-react';
import styles from './searchBar.module.css';
import { getCategories } from '@/api/listingApi';
import { getCategoryDisplayName } from '@/utils/listingUtils';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { useTranslation } from 'react-i18next';

export default function SearchBar({ radius, onRadiusChange, onCategoriesChange, searchQuery, onSearchChange, workType, onWorkTypeChange, hasLocation }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const { t } = useTranslation();

    //fetches categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true)
            try {
                const data = await getCategories()
                setCategories(data)
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setCategoriesLoading(false)
            }
        }
        fetchCategories()
    }, [])

    //watch for selectedCategories changes and notify parent comp
    useEffect(() => {
        onCategoriesChange?.(selectedCategories)
    }, [selectedCategories, onCategoriesChange])

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories(prev => {
            return prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
        })
    }

    const clearCategories = () => {
        setSelectedCategories([])
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Search className={styles.icon} size={20} />
                <input type="text" className={styles.input} placeholder="Search services..." value={searchQuery || ''} onChange={(e) => onSearchChange?.(e.target.value)} />
            </div>

            <div className={styles.filters}>
                {hasLocation && (
                    <div className={styles.filterGroup}>
                        <MapPin size={16} />
                        <label htmlFor="radius">{t('search.radius.label')}</label>
                        <select id="radius" className={styles.select} value={radius} onChange={(e) => onRadiusChange?.(Number(e.target.value))}>
                            <option value={5}>{t('search.radius.5')}</option>
                            <option value={10}>{t('search.radius.10')}</option>
                            <option value={25}>{t('search.radius.25')}</option>
                            <option value={50}>{t('search.radius.50')}</option>
                            <option value={100}>{t('search.radius.100')}</option>
                            <option value={150}>{t('search.radius.150')}</option>
                            <option value={200}>{t('search.radius.200')}</option>
                        </select>
                    </div>
                )}

                <div className={styles.filterGroup}>
                    <label>{t('search.workType.label')}</label>
                    <div className={styles.workTypeFilter}>
                        {hasLocation && (
                            <button className={`${styles.filterBtn} ${workType === 'BOTH' ? styles.active : ''}`} onClick={() => onWorkTypeChange?.('BOTH')}>
                                {t('search.workType.all')}
                            </button>
                        )}
                        <button className={`${styles.filterBtn} ${workType === 'ONLINE' ? styles.active : ''}`} onClick={() => onWorkTypeChange?.('ONLINE')}>
                            {t('search.workType.online')}
                        </button>
                        {hasLocation && (
                            <button className={`${styles.filterBtn} ${workType === 'IN_PERSON' ? styles.active : ''}`} onClick={() => onWorkTypeChange?.('IN_PERSON')}>
                                {t('search.workType.inPerson')}
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <Tag size={16} />
                    <label>Categories:</label>
                    <div className={styles.categoryFilterWrapper}>
                        <button className={`${styles.categoryDropdownBtn} ${selectedCategories.length > 0 ? styles.active : ''}`} onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                            {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : 'Select categories'}
                        </button>
                        
                        {showCategoryDropdown && (
                            <div className={styles.categoryDropdown}>
                                {categoriesLoading ? (
                                    <div className={styles.categoryLoading}>
                                        <LoadingSpinner size="small" />
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.categoryHeader}>
                                            <button className={styles.clearBtn} onClick={clearCategories}>
                                                {t('search.categories.clearAll')}
                                            </button>
                                        </div>
                                        
                                        <div className={styles.categoryList}>
                                            {categories.map((category) => (
                                                <label key={category.id} className={`${styles.categoryItem} ${selectedCategories.includes(category.id) ? styles.selected : ''}`}>
                                                    <input type="checkbox" checked={selectedCategories.includes(category.id)} onChange={() => handleCategoryToggle(category.id)} />
                                                    <span className={styles.categoryName}>{getCategoryDisplayName(category.category)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}