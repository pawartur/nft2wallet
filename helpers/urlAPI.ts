export function normaliseURL(url: string): string {
  if (url.startsWith("ipfs")) {
    return "https://ipfs.io/ipfs/"+url.split("ipfs://").slice(-1)
  } else {
    return url+"?format=json"
  }
}
