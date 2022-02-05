import { NextApiRequest, NextApiResponse } from "next";
import { generatePass } from "../../helpers/appleWalletPassAPI";
import { sendEmail } from "../../helpers/emailAPI";
import { fetchNFT } from "../../helpers/NFTAPI";
import { Moralis }  from "moralis";

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
        // TODO: Don't use hard-coded wallet address, take it from the request params
        const nft = await fetchNFT(
          "0x216f927a2f13CE1ab8ea00d6377dCd51Ce2E6f23",
          req.body["token_address"]
        )
        if (nft) {
          const pass = await generatePass(nft)
          const buf = await pass.asBuffer();
          console.log(buf)
          sendEmail(
            req.body["email_address"],
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
