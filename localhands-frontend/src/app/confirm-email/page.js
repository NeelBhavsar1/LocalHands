"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { confirmEmail } from '@/api/authApi'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import { useTranslation } from 'react-i18next'
import styles from './page.module.css'

function ConfirmEmailContent() {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage(t('confirmEmail.noToken'))
            return
        }

        const confirm = async () => {
            try {
                const result = await confirmEmail(token)
                setStatus('success')
                setMessage(result || t('confirmEmail.successMessage'))
            } catch (error) {
                setStatus('error')
                setMessage(error || t('confirmEmail.errorMessage'))
            }
        }

        confirm()
    }, [token])

    return (
        <>
            <HomeNavBar showLinks={false} />
            <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {status === 'loading' && t('confirmEmail.loading')}
                    {status === 'success' && t('confirmEmail.success')}
                    {status === 'error' && t('confirmEmail.failed')}
                </h1>
                
                <p className={`${styles.message} ${styles[status]}`}>
                    {message}
                    
                </p>

                {status !== 'loading' && (
                    <Link href="/dashboard" className={styles.link}>
                        {t('confirmEmail.goToDashboard')}
                    </Link>
                )}
            </div>
        </div>
        </>
    )
}

export default function ConfirmEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmEmailContent />
        </Suspense>
    )
}
