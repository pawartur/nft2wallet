import { NextApiRequest, NextApiResponse } from "next";
import { generatePass } from "../../helpers/backendAppleWalletPassAPI";
import { sendEmail } from "../../helpers/backendEmailAPI";
import { fetchNFT } from "../../helpers/NFTAPI";
import { Moralis }  from "moralis";
import { validateEmail } from "../../helpers/emailAPI";
import { ethers } from "ethers";

type Data = {
  message: string,
  error: string | undefined,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  Moralis.start({
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || "",
    appId:process.env.NEXT_PUBLIC_APP_ID || ""
  })

  switch(req.method) {
    case "POST":
      {
        const absoluteURL: string = req.body["absolute_url"]
        const walletAddress: string = req.body["wallet_address"]
        const tokenAddress: string = req.body["token_address"]
        const tokenId: string = req.body["token_id"]
        const emailAddress: string = req.body["email_address"]
        const signature: string = req.body["signature"]

        // Check the signature
        const messageToSign = JSON.stringify([
          absoluteURL,
          walletAddress,
          tokenAddress,
          tokenId,
          emailAddress
        ])
        
        const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(messageToSign))
        const signerAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(hash), signature)
        if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          res.status(400).json({ message: "Invalid signature", error: undefined})
          return;
        }

        if (!validateEmail(emailAddress)) {
          res.status(400).json({ message: "Invalid email address", error: undefined})
          return;
        }

        // TODO: Validate other params

        const nft = await fetchNFT(
          walletAddress,
          tokenAddress,
          tokenId
        )
        if (nft) {
          const pass = await generatePass(
            nft,
            absoluteURL,
            walletAddress
          )
          const buf = await pass.asBuffer();
          console.log(buf)
          sendEmail(
            emailAddress,
            "Click on the attachment to add your NFT to Apple Wallet!",
            [
              {
                filename: "nft.pkpass",
                content: buf,
                contentType: 'application/vnd.apple.pkpass'
              }
            ]
          )          
        }
        res.status(200).json({ message: "Create and send coupon request created", error: undefined})
      }
      break;
    default:
      break;
  }
}
