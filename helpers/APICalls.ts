import { NFT } from "../@types/types";

export async function sendCreatePassRequest(
  emailAddress: string,
  nft: NFT
) {
  // TODO: send all the data required to generate a QR code
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      token_name: nft.name,
      token_address: nft.token_address,
      email_address: emailAddress
    })
  };
  // TODO: Replace hard-coded base url with one passed in props from getServerSideProps
  fetch('http://localhost:3000/api/appleWalletPass', requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
}
