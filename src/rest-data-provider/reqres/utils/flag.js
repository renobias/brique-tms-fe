const isSuccesfullRequest = (code) => {
    if (code >= 200 && code < 300) {
        return true
    }
    return false
}

const isExpiredToken = (code) => {
    if (code >= 200 && code < 300) {
        return true
    }
    return false
}

export { isSuccesfullRequest, isExpiredToken };