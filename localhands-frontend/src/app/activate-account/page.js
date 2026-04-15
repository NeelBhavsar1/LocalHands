"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { activateAccount } from '@/api/authApi'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import { useTranslation } from 'react-i18next'
import styles from './page.module.css'

export default function ActivateAccountPage() {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage(t('activateAccount.noToken'))
            return
        }

        const activate = async () => {
            try {
                const result = await activateAccount(token)
                setStatus('success')
                setMessage(result || t('activateAccount.successMessage'))
            } catch (error) {
                setStatus('error')
                setMessage(error || t('activateAccount.errorMessage'))
            }
        }

        activate()
    }, [token])

    return (
        <>
            <HomeNavBar showLinks={false} />
            <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {status === 'loading' && t('activateAccount.loading')}
                    {status === 'success' && t('activateAccount.success')}
                    {status === 'error' && t('activateAccount.failed')}
                </h1>
                
                <p className={`${styles.message} ${styles[status]}`}>
                    {message}
                </p>

                {status !== 'loading' && (
                    <Link href="/login" className={styles.link}>
                        {t('activateAccount.goToLogin')}
                    </Link>
                )}
            </div>
        </div>
        </>
    )
}
