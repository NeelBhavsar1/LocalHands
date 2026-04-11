'use client'

import styles from './ReviewModal.module.css'

export default function ReviewModal({ isOpen, onClose, onSubmit, formData, onChange, submitting, t }) {
    if (!isOpen) {
        return null
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                
                <div className={styles.modalHeader}>
                    <h2>{t('writeReview')}</h2>
                    <button className={styles.closeButton} onClick={onClose}>x</button>
                </div>

                <form onSubmit={onSubmit} className={styles.reviewForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="rating">{t('rating')}</label>
                        <select id="rating" name="rating" value={formData.rating} onChange={onChange} className={styles.ratingSelect}>
                            
                            {[5, 4, 3, 2, 1].map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? t('star') : t('stars')}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="reviewBody">{t('review')}</label>
                        <textarea id="reviewBody" name="reviewBody" value={formData.reviewBody} onChange={onChange} placeholder={t('shareExperience')} rows={5} required className={styles.reviewTextarea} />
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            {t('cancel')}
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={submitting || !formData.reviewBody.trim()}>
                            {submitting ? t('submitting') : t('submitReview')}
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}
