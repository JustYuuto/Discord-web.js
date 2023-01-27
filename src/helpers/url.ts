export function urlParts() {
    const parts = window.location.pathname.split('/');
    parts.shift();
    return parts;
}
