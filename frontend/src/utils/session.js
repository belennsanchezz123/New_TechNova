let _sessionId = null;

export function setSessionId(id) {
    _sessionId = id;
}

export function getSessionId() {
    return _sessionId;
}

export default {
    setSessionId,
    getSessionId
};
