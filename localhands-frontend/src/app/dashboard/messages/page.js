"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import styles from './page.module.css'
import ChatSidebar from '@/components/ChatSidebar/ChatSidebar'
import ChatWindow from '@/components/ChatWindow/ChatWindow'
import { useWebSocket } from '@/configs/useWebSocket'
import { getInbox, getConversation, sendMessage } from '@/api/messageApi'
import { getUserInfo } from '@/api/userApi'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { findExistingConversation, createNewConversation, addConversationIfNotExists, updateConversationsList, isMessageRelevantToConversation, addMessageToList } from '@/utils/messagesUtils'
import { useRouter } from 'next/navigation'

function MessagesPageContent() {
    const { t } = useTranslation()
    const router = useRouter()
    const searchParams = useSearchParams()
    const urlUserId = searchParams.get('userId')
    const urlListingId = searchParams.get('listingId')

    const [currentUser, setCurrentUser] = useState(null)
    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [conversationData, setConversationData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)

    const { isConnected, messages: wsMessages, inboxUpdates, clearMessages: clearWsMessages, clearInboxUpdate } = useWebSocket(currentUser?.id)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserInfo()
                setCurrentUser(user)
            } catch (error) {
                console.error('Failed to fetch user:', error)
                router.push('/login')
                return
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const inbox = await getInbox()
                setConversations(inbox)

                if (urlUserId && urlListingId) {
                    const userId = parseInt(urlUserId)
                    const listingId = parseInt(urlListingId)

                    const existingConversation = findExistingConversation(inbox, userId, listingId)

                    if (existingConversation) {
                        setSelectedConversation(existingConversation)
                        try {
                            const data = await getConversation(userId, listingId)
                            setConversationData(data)
                            setMessages(data.conversation || [])
                        } catch (error) {
                            console.error('Failed to fetch conversation:', error)
                        }
                    } else {
                        try {
                            const data = await getConversation(userId, listingId)
                            const newConversation = createNewConversation(listingId, userId, data)
                            setConversations(prev => addConversationIfNotExists(prev, newConversation))

                            setSelectedConversation(newConversation)
                            setConversationData(data)
                            setMessages(data.conversation || [])

                        } catch (error) {
                            console.error('Failed to fetch conversation:', error)
                            alert(t('messages.failedToSend'))
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch inbox:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInbox()
    }, [urlUserId, urlListingId])

    useEffect(() => {
        if (wsMessages.length > 0) {
            const latestMessage = wsMessages[wsMessages.length - 1]

            if (isMessageRelevantToConversation(latestMessage, selectedConversation, currentUser?.id)) {
                setMessages(prev => addMessageToList(prev, latestMessage))
            }
        }
    }, [wsMessages, selectedConversation, currentUser])

    useEffect(() => {
        if (inboxUpdates) {
            setConversations(prev => updateConversationsList(prev, inboxUpdates))
            clearInboxUpdate()
        }
    }, [inboxUpdates, clearInboxUpdate])

    const handleSelectConversation = useCallback(async (conversation) => {
        setSelectedConversation(conversation)
        setMessages([])
        clearWsMessages()
        setIsMobileChatOpen(true)
        
        try {
            const data = await getConversation(conversation.otherUserId, conversation.listingId)
            setConversationData(data)
            setMessages(data.conversation || [])
        } catch (error) {
            console.error('Failed to fetch conversation:', error)
        }
    }, [clearWsMessages])

    const handleBackToInbox = useCallback(() => {
        setIsMobileChatOpen(false)
    }, [])

    const handleSendMessage = useCallback(async (messageText) => {
        if (!selectedConversation || !currentUser || sending) {
            return
        }
        
        setSending(true)
        try {
            await sendMessage(selectedConversation.otherUserId, selectedConversation.listingId, messageText)
        } catch (error) {
            console.error('Failed to send message:', error)
            alert(t('messages.failedToSend'))
        } finally {
            setSending(false)
        }
    }, [selectedConversation, currentUser, sending])

    if (loading) {
        return (
            <div className={styles.container}>
                <LoadingSpinner />
            </div>
        )
    }
    
    
    if (!currentUser) { return null; }

    return (
        <div className={styles.container}>
            <div className={styles.messagingLayout}>
                
                <div className={`${styles.sidebarContainer} ${isMobileChatOpen ? styles.sidebarHidden : ''}`}>
                    <ChatSidebar conversations={conversations} selectedConversation={selectedConversation} onSelectConversation={handleSelectConversation} currentUserId={currentUser?.id} />
                </div>

                <div className={`${styles.chatArea} ${isMobileChatOpen ? styles.chatOpen : ''}`}>
                    <ChatWindow conversation={selectedConversation} messages={messages} currentUser={currentUser} onSendMessage={handleSendMessage} canSendMessages={conversationData?.canSendMessages ?? true} listingTitle={conversationData?.listingTitle || selectedConversation?.listingTitle} otherUserName={conversationData?.otherUserName || selectedConversation?.otherUserName} otherUserProfilePicture={conversationData?.otherUserProfilePicture || selectedConversation?.otherUserProfilePicture} onBack={handleBackToInbox} isMobile={typeof window !== 'undefined' && window.innerWidth <= 768} />
                </div>
            </div>
        </div>
    )
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MessagesPageContent />
        </Suspense>
    )
}