import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChatWindow.module.css';
import { Send, ChevronLeft } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8080';

export default function ChatWindow({ conversation, messages, currentUser, onSendMessage, canSendMessages, listingTitle, otherUserName, otherUserProfilePicture, onBack, isMobile }) {
    const { t } = useTranslation();
    const [inputMessage, setInputMessage] = useState('')
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    };

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        if (conversation) {
            inputRef.current?.focus()
        }
    }, [conversation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !canSendMessages) {
            return;
        }
        
        onSendMessage(inputMessage.trim())
        setInputMessage('')
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) {
            return ''
        }

        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const formatMessageDate = (timestamp) => {
        if (!timestamp) {
            return ''
        }
        const date = new Date(timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (date.toDateString() === today.toDateString()) {
            return t('messages.today')
        } else if (date.toDateString() === yesterday.toDateString()) {
            return t('messages.yesterday')
        }

        return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
    };

    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentGroup = null;
        
        messages.forEach((message) => {
            const date = formatMessageDate(message.sentTime)
            if (date !== currentGroup?.date) {
                currentGroup = { date, messages: [] }
                groups.push(currentGroup)
            }
            currentGroup.messages.push(message)
        })
        
        return groups
    };

    if (!conversation) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyContent}>
                    <h3>{t('messages.selectConversation')}</h3>
                    <p>{t('messages.selectConversationSubtitle')}</p>
                </div>
            </div>
        );
    }

    const messageGroups = groupMessagesByDate(messages)

    return (
        <div className={styles.chatWindow}>
            <div className={styles.header}>
                {isMobile && onBack && (
                    <button onClick={onBack} className={styles.backButton}>
                        <ChevronLeft size={24} />
                    </button>
                )}
                <img src={otherUserProfilePicture ? `${BACKEND_URL}${otherUserProfilePicture}` : '/profile.png'} alt={otherUserName} className={styles.headerAvatar} />
                <div className={styles.headerInfo}>
                    <h3 className={styles.headerName}>{otherUserName}</h3>
                    <p className={styles.headerListing}>{listingTitle}</p>
                </div>
            </div>

            <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                    <div className={styles.noMessages}>
                        <p>{t('messages.noMessages')}</p>
                    </div>
                ) : (
                    messageGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className={styles.messageGroup}>
                            <div className={styles.dateDivider}>
                                <span>{group.date}</span>
                            </div>
                            {group.messages.map((message) => {
                                const isOwnMessage = message.senderId === currentUser?.id;
                                
                                return (
                                    <div key={message.id} className={`${styles.message} ${isOwnMessage ? styles.ownMessage : styles.otherMessage}`}>
                                        <div className={styles.messageContent}>

                                            <p className={styles.messageText}>{message.message}</p>
                                            <span className={styles.messageTime}>
                                                {formatMessageTime(message.sentTime)}
                                            </span>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className={styles.inputArea}>
                {!canSendMessages ? (
                    <div className={styles.disabledInput}>
                        <p>{t('messages.messagingDisabled')}</p>
                    </div>
                ) : (
                    <>
                        <input ref={inputRef} type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder={t('messages.typeMessage')} className={styles.messageInput} />
                        <button type="submit" disabled={!inputMessage.trim()} className={styles.sendButton} aria-label={t('messages.send')}>
                            <Send size={20} />
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
