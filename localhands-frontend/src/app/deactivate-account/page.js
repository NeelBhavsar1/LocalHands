"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { deactivateAccount } from '@/api/authApi'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import { useTranslation } from 'react-i18next'
import styles from './page.module.css'

function DeactivateAccountContent() {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage(t('deactivateAccount.noToken'))
            return
        }

        const deactivate = async () => {
            try {
                const result = await deactivateAccount(token)
                setStatus('success')
                setMessage(result || t('deactivateAccount.successMessage'))
            } catch (error) {
                setStatus('error')
                setMessage(error || t('deactivateAccount.errorMessage'))
            }
        }

        deactivate()
    }, [token])

    return (
        <>
            <HomeNavBar showLinks={false} />
            <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {status === 'loading' && t('deactivateAccount.loading')}
                    {status === 'success' && t('deactivateAccount.success')}
                    {status === 'error' && t('deactivateAccount.failed')}
                </h1>
                
                <p className={`${styles.message} ${styles[status]}`}>
                    {message}
                </p>

                {status !== 'loading' && (
                    <Link href="/" className={styles.link}>
                        {t('deactivateAccount.returnHome')}
                    </Link>
                )}
            </div>
        </div>
        </>
    )
}

export default function DeactivateAccountPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DeactivateAccountContent />
        </Suspense>
    )
}
