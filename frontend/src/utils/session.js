export function setSessionId(id) {
    if (id) {
        localStorage.setItem('session_id', id);
    }
}

export function getSessionId() {
    return localStorage.getItem('session_id');
}

export default { setSessionId, getSessionId };