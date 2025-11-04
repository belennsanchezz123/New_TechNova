export function setParticipantId(id) {
    if (!id || id.trim() === '') {
        throw new Error('Participant ID cannot be empty');
    }
    localStorage.setItem('participant_id', id.trim());
}

export function getParticipantId() {
    return localStorage.getItem('participant_id');
}

export function clearParticipantId() {
    localStorage.removeItem('participant_id');
}