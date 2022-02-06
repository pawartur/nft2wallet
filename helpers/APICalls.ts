import { NFT } from "../@types/types";

export async function sendCreatePassRequest(
  absoluteURL: string,
  authenticatedWalletAddress: string,
  emailAddress: string,
  nft: NFT
) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      absoluteURL: absoluteURL,
      authenticatedWalletAddress: authenticatedWalletAddress,
      token_address: nft.token_address,
      email_address: emailAddress
    })
  };
  fetch(absoluteURL+'/api/appleWalletPass', requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
}
