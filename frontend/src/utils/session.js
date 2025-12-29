export function setSessionId(id) {
    if (id) {
        localStorage.setItem('lynx_session_id', id);
    }
}

export function getSessionId() {
    return localStorage.getItem('lynx_session_id');
}

export default {
    setSessionId,
    getSessionId
};