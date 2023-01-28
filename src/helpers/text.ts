export function copyText(text: string | number) {
    navigator.clipboard.writeText(text.toString()).then(() => {}, (err) => {
        throw err;
    });
}
