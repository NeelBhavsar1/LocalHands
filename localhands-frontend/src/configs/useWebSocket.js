import { useEffect, useRef, useCallback, useState } from 'react';
import { Client } from '@stomp/stompjs';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export function useWebSocket(currentUserId) {
    const clientRef = useRef(null)
    const [isConnected, setIsConnected] = useState(false)
    const [messages, setMessages] = useState([])
    const [inboxUpdates, setInboxUpdates] = useState(null)

    const connect = useCallback(() => {
        if (!currentUserId || clientRef.current?.active) {
            return
        }

        const wsUrl = BACKEND_URL.startsWith('https')
            ? BACKEND_URL.replace('https', 'wss')
            : BACKEND_URL.replace('http', 'ws')

        const client = new Client({
            brokerURL: `${wsUrl}/ws`,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket connected')
                setIsConnected(true)

                client.subscribe('/user/queue/messages', (message) => {
                    const body = JSON.parse(message.body)
                    setMessages(prev => {
                        if (prev.length > 0 && prev[prev.length - 1].id === body.id) {
                            return prev
                        }
                        return [...prev, body]
                    })
                }, { id: 'messages-sub' })

                client.subscribe('/user/queue/inbox', (message) => {
                    const body = JSON.parse(message.body)
                    setInboxUpdates(body)
                }, { id: 'inbox-sub' })
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected')
                setIsConnected(false)
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame)
                setIsConnected(false)
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error)
                setIsConnected(false)
            },
        })

        client.activate()
        clientRef.current = client
    }, [currentUserId])

    const disconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.deactivate()
            clientRef.current = null
            setIsConnected(false)
        }
    }, [])

    useEffect(() => {
        if (currentUserId) {
            connect()
        }

        return () => {
            disconnect()
        }
    }, [currentUserId, connect, disconnect])

    const clearMessages = useCallback(() => {
        setMessages([])
    }, [])

    const clearInboxUpdate = useCallback(() => {
        setInboxUpdates(null)
    }, [])

    return {
        isConnected,
        messages,
        inboxUpdates,
        clearMessages,
        clearInboxUpdate,
    }
}
