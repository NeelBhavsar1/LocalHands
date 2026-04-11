"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { deactivateAccount } from '@/api/authApi'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import styles from './page.module.css'

export default function DeactivateAccountPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('No deactivation token provided.')
            return
        }

        const deactivate = async () => {
            try {
                const result = await deactivateAccount(token)
                setStatus('success')
                setMessage(result || 'Account deactivated successfully. You have been logged out.')
            } catch (error) {
                setStatus('error')
                setMessage(error || 'Account deactivation failed. The token may be invalid or expired.')
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
                    {status === 'loading' && 'Deactivating Account...'}
                    {status === 'success' && 'Account Deactivated'}
                    {status === 'error' && 'Deactivation Failed'}
                </h1>
                
                <p className={`${styles.message} ${styles[status]}`}>
                    {message}
                </p>

                {status !== 'loading' && (
                    <Link href="/" className={styles.link}>
                        Return Home
                    </Link>
                )}
            </div>
        </div>
        </>
    )
}
