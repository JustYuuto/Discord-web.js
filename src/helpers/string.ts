export function cleanJSON(json: string): string {
  return json
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;');
}
