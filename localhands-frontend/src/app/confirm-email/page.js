"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { confirmEmail } from '@/api/authApi'
import HomeNavBar from '@/components/HomeNavBar/HomeNavBar'
import styles from './page.module.css'

export default function ConfirmEmailPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('No confirmation token provided.')
            return
        }

        const confirm = async () => {
            try {
                const result = await confirmEmail(token)
                setStatus('success')
                setMessage(result || 'Email confirmed successfully!')
            } catch (error) {
                setStatus('error')
                setMessage(error || 'Email confirmation failed. The token may be invalid or expired.')
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
                    {status === 'loading' && 'Confirming Email...'}
                    {status === 'success' && 'Email Confirmed!'}
                    {status === 'error' && 'Confirmation Failed'}
                </h1>
                
                <p className={`${styles.message} ${styles[status]}`}>
                    {message}
                    
                </p>

                {status !== 'loading' && (
                    <Link href="/dashboard" className={styles.link}>
                        Go to Dashboard
                    </Link>
                )}
            </div>
        </div>
        </>
    )
}
