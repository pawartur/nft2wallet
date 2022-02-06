import { NFT } from "../@types/types";
import { Moralis }  from "moralis";
import  Web3 from 'web3';

function signMessageWithDefaultAccount(
  message: string
): Promise<string> {
  return new Promise( (resolve, reject) => {
    // @ts-ignore
    const web3 = new Web3(Moralis.provider)
    web3.eth.getAccounts().then(accounts => {
      const defaultAccount = accounts[0]
      if (defaultAccount) {
        const hash = web3.utils.sha3(message) || ""
        web3.eth.sign(hash, defaultAccount, function (err: any, signature: any) {
          resolve(signature)
        });
      } else {
        reject("No account found")
      }
    }).catch( error => {
      reject(error)
    })
  })
}

export async function sendCreatePassRequest(
  absoluteURL: string,
  authenticatedWalletAddress: string,
  emailAddress: string,
  nft: NFT
): Promise<Response>  {

  const messageToSign = JSON.stringify([
    absoluteURL,
    authenticatedWalletAddress,
    nft.token_address,
    nft.token_id,
    emailAddress
  ])
  
  const signature = await signMessageWithDefaultAccount(messageToSign)

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      absolute_url: absoluteURL,
      wallet_address: authenticatedWalletAddress,
      token_address: nft.token_address,
      token_id: nft.token_id,
      email_address: emailAddress,
      signature
    })
  };

  return fetch(absoluteURL+'/api/appleWalletPass', requestOptions)
}
