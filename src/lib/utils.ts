// Generate or retrieve anonymous session ID
export function getSessionId(): string {
    if (typeof window === 'undefined') return ''

    let sessionId = localStorage.getItem('scanit_session_id')
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
        localStorage.setItem('scanit_session_id', sessionId)
    }
    return sessionId
}

// Format date for display
export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(date))
}

// Get verification status color and label
export function getVerificationStatus(status: string): { color: string; label: string; emoji: string } {
    switch (status) {
        case 'authentic':
            return { color: 'text-green-500', label: 'Verified Authentic', emoji: '✅' }
        case 'suspicious':
            return { color: 'text-yellow-500', label: 'Suspicious', emoji: '⚠️' }
        case 'fake':
            return { color: 'text-red-500', label: 'Reported Fake', emoji: '❌' }
        default:
            return { color: 'text-gray-500', label: 'Unknown', emoji: '❓' }
    }
}
