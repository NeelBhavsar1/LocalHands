import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { User } from 'lucide-react';
import styles from './ChatSidebar.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

export default function ChatSidebar({ conversations, selectedConversation, onSelectConversation, currentUserId }) {
    const { t } = useTranslation();
    const formatTime = (timestamp) => {

        if (!timestamp) return ''
        const date = new Date(timestamp)
        const now = new Date()
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    };

    const truncateMessage = (message, maxLength = 40) => {
        if (!message) return '';
        return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>{t('messages.title')}</h2>
            </div>

            <div className={styles.conversationList}>
                {conversations.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>{t('messages.noConversations')}</p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        const isSelected = selectedConversation?.listingId === conversation.listingId && selectedConversation?.otherUserId === conversation.otherUserId;
                        
                        return (
                            <div key={`${conversation.listingId}-${conversation.otherUserId}`} className={`${styles.conversationItem} ${isSelected ? styles.selected : ''}`} onClick={() => onSelectConversation(conversation)}>
                                <img src={conversation.otherUserProfilePicture ? `${BACKEND_URL}${conversation.otherUserProfilePicture}` : '/profile.png'} alt={conversation.otherUserName} className={styles.profilePicture} />
                                <div className={styles.conversationInfo}>

                                    <div className={styles.nameRow}>
                                        <span className={styles.userName}>{conversation.otherUserName}</span>
                                        
                                        <Link href={`/profile/${conversation.otherUserId}`} className={styles.viewProfileLink} title="View profile" onClick={(e) => e.stopPropagation()}>
                                            <User size={14} />
                                        
                                        </Link>
                                        <span className={styles.time}>{formatTime(conversation.lastMessageTime)}</span>
                                    </div>

                                    <p className={styles.listingTitle}>{conversation.listingTitle}</p>
                                    <p className={styles.lastMessage}>{truncateMessage(conversation.lastMessage)}</p>
                                </div>
                            </div>
                        );
                        
                    })
                )}
            </div>
        </div>
    );
}
