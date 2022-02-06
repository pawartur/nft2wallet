export function normaliseURL(url: string): string {
  if (url.startsWith("ipfs")) {
    return "https://ipfs.io/ipfs/"+url.split("ipfs://").slice(-1)
  } else if (url.startsWith("http") || url.startsWith("https")) {
    return url+"?format=json"
  } else if (url.startsWith("data:image")) {
    return url
  } else {
    return "https://i.ibb.co/4Fqw7b6/missing-Image.png"
  }
}
