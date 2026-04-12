// Conversation utility functions

export const findExistingConversation = (conversations, userId, listingId) => {
    return conversations.find(
        c => c.otherUserId === userId && c.listingId === listingId
    )
}

export const createNewConversation = (listingId, userId, data) => ({ listingId, otherUserId: userId, otherUserName: data.otherUserName, listingTitle: data.listingTitle, otherUserProfilePicture: data.otherUserProfilePicture, lastMessage: '', lastMessageTime: null })

export const addConversationIfNotExists = (conversations, newConversation) => {
    const exists = conversations.some(
        c => c.listingId === newConversation.listingId && c.otherUserId === newConversation.otherUserId
    )
    if (exists) return conversations
    return [newConversation, ...conversations]
}

export const sortConversationsByTime = (conversations) => {
    return [...conversations].sort((a, b) => {
        if (!a.lastMessageTime) return 1
        if (!b.lastMessageTime) return -1
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    })
}

export const updateConversationsList = (conversations, inboxUpdate) => {
    const existingIndex = conversations.findIndex(
        c => c.listingId === inboxUpdate.listingId && c.otherUserId === inboxUpdate.otherUserId
    )

    let updated
    if (existingIndex >= 0) {
        updated = [...conversations]
        updated[existingIndex] = inboxUpdate
    } else {
        updated = [inboxUpdate, ...conversations]
    }

    return sortConversationsByTime(updated)
}

//message utility functions

export const isMessageRelevantToConversation = (message, conversation, currentUserId) => {
    if (!conversation || !currentUserId) return false

    return (
        (message.senderId === conversation.otherUserId && message.recipientId === currentUserId) ||
        (message.senderId === currentUserId && message.recipientId === conversation.otherUserId)
    )
}

//deduplicate messages for list by id
export const deduplicateMessages = (messages, newMessage) => {
    const exists = messages.some(m => m.id === newMessage.id)
    if (exists) return messages
    return [...messages, newMessage]
}

//add message to list
export const addMessageToList = (messages, newMessage) => {
    return deduplicateMessages(messages, newMessage)
}
