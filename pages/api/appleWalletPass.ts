import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "../../helpers/emailAPI";

type Data = {
  message: string,
  error: string | undefined,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  switch(req.method) {
    case "POST":
      {
        sendEmail(
          req.body["email_address"],
          "Shortly we'll be able to send you your NFT called" + req.body["token_name"]
        )
        res.status(200).json({ message: "Sent", error: undefined})
      }
      break;
    default:
      break;
  }
}


