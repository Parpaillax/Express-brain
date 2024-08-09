export default function extractBearerToken(headerValue) {
    if (typeof headerValue !== 'string') {
        return false;
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i);
    return matches && matches[2];
}