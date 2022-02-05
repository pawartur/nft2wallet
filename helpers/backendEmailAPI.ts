import { EmailAttachment } from "../@types/types";

export async function sendEmail(
  recipientAddress: string,
  body: string,
  attachments?: EmailAttachment[]
) {
      let nodemailer = require('nodemailer')
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nft2wallet@gmail.com',
          pass: 'puhdrytvbczhckhb'
        }
      });

      const mailData = {
        from: 'nft2wallet@gmail.com',
        to: recipientAddress,
        subject: `Your NFT Pass from NFT2Wallet!`,
        text: body,
        attachments: attachments
      }
      transporter.sendMail(mailData, function (err: any, info: any) {
        if(err)
          console.log(err)
        else
          console.log(info)
      })
}

export {}
