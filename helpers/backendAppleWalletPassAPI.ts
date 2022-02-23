const { Template } = require("@walletpass/pass-js");
const im = require('imagemagick');
import path from 'path'
import fs from 'fs'
import { NFT } from '../@types/types'
import { normaliseURL } from './urlAPI';

const getResizePromise = (
  image: any
  ) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      im.resize({
        srcPath: "png:-",
        srcData: image,
        format: 'png',
        width: 375,
        height: 144,
        customArgs: [
          '-background',
          'rgb(39, 45, 115)',
          '-gravity',
          'center',
          '-extent',
          '375x144'
        ]
      }, 
      function(err: any, stdout: any){
        resolve(Buffer.from(stdout, "binary"))
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
  template.barcodes = [
    {
    "message" : verificationURL,
    "format" : "PKBarcodeFormatQR",
    "messageEncoding" : "iso-8859-1"
    }
  ]
  await template.images.add("icon", "./resources/passes/NFT.pass/icon.png")
  await template.images.add("logo", "./resources/passes/NFT.pass/logo.png")
  if (image) {
    const resized = await getResizePromise(
      image
    )
    await template.images.add("strip", resized)
  }

  await template.loadCertificate("./resources/cert/NFT2WalletSignerCert.pem", "nft2wallet");
  template.serialNumber = nft.token_address

  const pass = template.createPass();
  return pass
}
  
export  {};
