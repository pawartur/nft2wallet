const { Template } = require("@walletpass/pass-js");
const im = require('imagemagick');
import path from 'path'
import fs from 'fs'
import { NFT, NFTMetaData } from '../@types/types'
import { normaliseURL } from './urlAPI';

const getResizePromise = (
  image: any,
  filepath: string,
  resizedFilepath: string
  ) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('WRITING TO filepath')
      fs.writeFileSync(filepath, image, 'binary');
      console.log('FINISHED WRITING TO filepath')
      im.convert([
        filepath, 
        '-resize', 
        '375x144', 
        '-background',
        'rgb(39, 45, 115)',
        '-gravity',
        'center',
        '-extent',
        '375x144',
        resizedFilepath
      ], 
      function(err: any, stdout: any){
        console.log("RESOLVING RESIZING PROMISE")
        resolve("Success")
      });
    }, 60);
  });
}

export async function generatePass(
  nft: NFT,
  appBaseURL: string,
  walletAddress: string
): Promise<any> {
  // FIXME: Don't store the cert in the repo in the final product ;P 
  const dir = path.resolve('./resources');

  let nftName = nft.name
  let nftDescription = ""
  let image: any | undefined = undefined
  if (nft?.token_uri) {
    const response = await fetch(nft.token_uri, {method: 'GET'})
    const nftMetaData = await response.json()
    nftName = nftMetaData.name
    nftDescription = nftMetaData.description
    const imageURL = nftMetaData.image_url || nftMetaData.image
    console.log("IMAGE URL: " + imageURL)
    if (imageURL) {
      const response = await fetch(normaliseURL(imageURL));
      const arrayBuffer = await response.arrayBuffer();
      image = Buffer.from(arrayBuffer);
    }
  }

  const template = new Template("coupon", {
    passTypeIdentifier: "pass.me.arturwdowiarski.first-pass",
    teamIdentifier: "Y23Q74DCEK",
    organizationName : "NFT 2 Wallet",
    logoText: "NFT 2 Wallet",
    foregroundColor : "rgb(203, 213, 225)",
    backgroundColor : "rgb(39, 45, 115)",
    labelColor: "rgb(253, 186, 116)",
    description: "NFT 2 Wallet Pass",
    sharingProhibited: true,
    coupon: {
      secondaryFields : [
        {
          "key" : "name",
          "value" : nftName
        },
        {
          "key" : "description",
          "label" : "INFO",
          "value" : nftDescription
        }
      ]
    }
  });
  const verificationURL = appBaseURL + "/verify/" + nft.token_address + "?walletAddress=" + walletAddress + "&tokenId=" + nft.token_id
  console.log("VERIFICATION URL = " + verificationURL)
  template.barcodes = [
    {
    "message" : verificationURL,
    "format" : "PKBarcodeFormatQR",
    "messageEncoding" : "iso-8859-1"
    }
  ]
  await template.images.add("icon", "./resources/passes/NFT.pass/icon.png")
  await template.images.add("logo", "./resources/passes/NFT.pass/logo.png")
  const filepath = "./resources/" + nft.token_address + ":" + nft.token_id + ".png"
  const resizedFilepath = "./resources/" + nft.token_address + ":" + nft.token_id + "-resized.png"
  if (image) {
    if (!fs.existsSync(resizedFilepath)) {
      console.log("FILE DOESN'T EXIST AT resizedFilepath")
      await getResizePromise(
        image,
        filepath,
        resizedFilepath
      )
      console.log("FINISHED WAITING FOR PROMISE")
    } else {
      console.log("FILE EXISTS AT resizedFilepath")
    }
    console.log("TRYING TO ADD STRIP")
    await template.images.add("strip", resizedFilepath)
  }

  await template.loadCertificate("./resources/cert/NFT2WalletSignerCert.pem", "nft2wallet");
  template.serialNumber = nft.token_address

  const pass = template.createPass();
  return pass
}
  
export  {};
