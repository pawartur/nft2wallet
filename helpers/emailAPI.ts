export async function sendEmail(
  recipientAddress: string,
  body: string
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
      }
      transporter.sendMail(mailData, function (err: any, info: any) {
        if(err)
          console.log(err)
        else
          console.log(info)
      })
}


export {}
