export function validateParticipantId(id) {
    if (!id || id.trim() === '') {
        return { valid: false, error: 'Participant ID cannot be empty' };
    }

    const trimmedId = id.trim().toUpperCase();
    const pattern = /^P(0[0-4][0-9]|050)$/;

    if (!pattern.test(trimmedId)) {
        return { valid: false, error: 'Invalid Participant ID. Valid IDs are P001 to P050' };
    }

    return { valid: true, id: trimmedId };
}

export function setParticipantId(id) {
    const validation = validateParticipantId(id);
    if (!validation.valid) {
        throw new Error(validation.error);
    }
    localStorage.setItem('participant_id', validation.id);
}

export function getParticipantId() {
    return localStorage.getItem('participant_id');
}

export function clearParticipantId() {
    localStorage.removeItem('participant_id');
}