import { NFT } from "../@types/types";

export async function sendCreatePassRequest(
  absoluteURL: string,
  authenticatedWalletAddress: string,
  emailAddress: string,
  nft: NFT
): Promise<Response>  {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      absolute_url: absoluteURL,
      wallet_address: authenticatedWalletAddress,
      token_address: nft.token_address,
      token_id: nft.token_id,
      email_address: emailAddress
    })
  };
  return fetch(absoluteURL+'/api/appleWalletPass', requestOptions)
}
