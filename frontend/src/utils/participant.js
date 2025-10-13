export function getParticipantId() {
    let pid = localStorage.getItem('participant_id');
    if (!pid) {
        pid = crypto.randomUUID();
        localStorage.setItem('participant_id', pid);
    }
    return pid;
}