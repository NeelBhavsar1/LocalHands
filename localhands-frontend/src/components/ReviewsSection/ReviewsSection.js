'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './ReviewsSection.module.css'
import { Star, ChevronDown, ChevronUp, Pencil, Trash2, ExternalLink } from 'lucide-react'
import api from '../../api/api'

export default function ReviewsSection({ reviews, backendUrl, t, currentUser, onReviewUpdated, onReviewDeleted, showViewListing, onViewListing }) {
    const [expandedReview, setExpandedReview] = useState(null)
    const [editingReview, setEditingReview] = useState(null)
    const [editForm, setEditForm] = useState({ rating: 5, reviewBody: '' })
    const [loading, setLoading] = useState(false)

    if (!reviews || reviews.length === 0) {
        return null
    }

    const toggleReview = (reviewId) => {
        if (editingReview === reviewId) return
        setExpandedReview(expandedReview === reviewId ? null : reviewId)
        setEditingReview(null)
    }

    const startEditing = (review, e) => {
        e.stopPropagation()
        setEditingReview(review.id)
        setEditForm({ rating: review.rating, reviewBody: review.reviewBody })
        setExpandedReview(review.id)
    }

    const cancelEditing = (e) => {
        e.stopPropagation()
        setEditingReview(null)
        setEditForm({ rating: 5, reviewBody: '' })
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }))
    }

    const handleUpdate = async (e, reviewId) => {
        e.preventDefault()
        e.stopPropagation()
        setLoading(true)

        try {
            const response = await api.put("/api/reviews", {
                reviewId: reviewId,
                rating: editForm.rating,
                reviewBody: editForm.reviewBody
            })

            const updatedReview = response.data
            onReviewUpdated?.(updatedReview)
            setEditingReview(null)
            alert('Review updated successfully!')

        } catch (error) {
            alert('Error updating review: ' + error.message)

        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (reviewId, e) => {
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return
        }

        try {
            await api.delete(`/api/reviews?reviewId=${reviewId}`)

            onReviewDeleted?.(reviewId)
            setExpandedReview(null)
            alert('Review deleted successfully!')
        } catch (error) {
            alert('Error deleting review: ' + error.message)
        }
    }

    const isOwner = (review) => currentUser && review.userId === currentUser.id

    const renderStars = (rating) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={star <= rating ? styles.starFilled : styles.starEmpty} fill={star <= rating ? 'currentColor' : 'none'} />
                ))}
            </div>
        )
    }

    return (
        <div className={styles.reviewsSection}>
            
            <h3 className={styles.reviewsHeader}>
                {t('profile.reviews')} ({reviews.length})
            </h3>

            <div className={styles.reviewsList}>
                {reviews.map((review) => (
                    
                    <div key={review.id} className={`${styles.reviewCard} ${expandedReview === review.id ? styles.expanded : ''}`}>
                        <button className={styles.reviewHeader} onClick={() => toggleReview(review.id)}>
                           
                            <Link href={`/profile/${review.userId}`} className={styles.reviewUser}>
                                <img src={review.userProfilePhoto ? `${backendUrl}${review.userProfilePhoto}` : '/profile.png'} alt={review.userName} className={styles.reviewUserPfp} />
                                <span className={styles.reviewUserName}>{review.userName}</span>
                            </Link>

                            <div className={styles.reviewMeta}>
                                {renderStars(review.rating)}
                                {expandedReview === review.id ? (
                                    <ChevronUp size={18} className={styles.chevron} />
                                ) : (
                                    <ChevronDown size={18} className={styles.chevron} />
                                )}
                            </div>

                        </button>

                        {expandedReview === review.id && (
                            <div className={styles.reviewBody}>
                                {editingReview === review.id ? (
                                    
                                    <form onSubmit={(e) => handleUpdate(e, review.id)} className={styles.editForm}>
                                        <div className={styles.formGroup}>
                                            <label>{t('rating')}</label>
                                            <select name="rating" value={editForm.rating} onChange={handleEditChange} className={styles.ratingSelect}>
                                                {[5, 4, 3, 2, 1].map((num) => (
                                                    <option key={num} value={num}>{num} {num === 1 ? t('star') : t('stars')}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>{t('review')}</label>
                                            <textarea name="reviewBody" value={editForm.reviewBody} onChange={handleEditChange} rows={4} required className={styles.editTextarea} />
                                        </div>

                                        <div className={styles.editActions}>
                                            <button type="button" onClick={cancelEditing} className={styles.cancelEditBtn}>{t('cancel')}</button>
                                            <button type="submit" className={styles.saveEditBtn} disabled={loading}>{loading ? t('saving') : t('saveChanges')}</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <p>{review.reviewBody}</p>
                                        <div className={styles.reviewFooter}>
                                            <span className={styles.reviewDate}>
                                                {new Date(review.creationTime).toLocaleDateString()}
                                            </span>

                                            <div className={styles.reviewActions}>
                                                {review.listingId && (
                                                    <Link href={`/listings/${review.listingId}`} className={styles.serviceLinkBtn} title={`${t('review.forService')} ${review.serviceTitle || ''}`}>
                                                        <ExternalLink size={14} />
                                                        <span>{t('viewListing')}</span>
                                                    </Link>
                                                )}
                                                
                                                {showViewListing && onViewListing && (
                                                    <button onClick={(e) => { e.stopPropagation(); onViewListing(review.listingId) }} className={styles.viewListingBtn} title={t('viewListing')}>
                                                        <ExternalLink size={16} />
                                                        <span>{t('viewListing')}</span>
                                                    </button>
                                                )}

                                                {isOwner(review) && (
                                                <div className={styles.reviewActions}>
                                                    <button onClick={(e) => startEditing(review, e)} className={styles.editBtn} title={t('editReview')}>
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button onClick={(e) => handleDelete(review.id, e)} className={styles.deleteBtn} title={t('deleteReview')}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
