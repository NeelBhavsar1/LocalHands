"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { activateAccount } from '@/api/authApi'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import styles from './page.module.css'

export default function ActivateAccountPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('No activation token provided.')
            return
        }

        const activate = async () => {
            try {
                const result = await activateAccount(token)
                setStatus('success')
                setMessage(result || 'Account activated successfully!')
            } catch (error) {
                setStatus('error')
                setMessage(error || 'Account activation failed. The token may be invalid or expired.')
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
                    {status === 'loading' && 'Activating Account...'}
                    {status === 'success' && 'Account Activated!'}
                    {status === 'error' && 'Activation Failed'}
                </h1>
                
                <p className={`${styles.message} ${styles[status]}`}>
                    {message}
                </p>

                {status !== 'loading' && (
                    <Link href="/login" className={styles.link}>
                        Go to Login
                    </Link>
                )}
            </div>
        </div>
        </>
    )
}
