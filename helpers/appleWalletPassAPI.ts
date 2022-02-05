const { Template } = require("@walletpass/pass-js");
import path from 'path'
import { NFT, NFTMetaData } from '../@types/types'
import { normaliseURL } from './urlAPI';

export async function generatePass(nft: NFT): Promise<any> {
  // FIXME: Don't store the cert in the repo in the final product ;P 
  const dir = path.resolve('./resources');

  let nftName = nft.name
  // let thumbnail: any | undefined = undefined
  if (nft?.token_uri) {
    const response = await fetch(nft.token_uri, {method: 'GET'})
    const nftMetaData = await response.json()
    nftName = nftMetaData.name
    const imageURL = nftMetaData.image_url || nftMetaData.image
    // if (imageURL) {
    //   const response = await fetch(normaliseURL(imageURL));
    //   const arrayBuffer = await response.arrayBuffer();
    //   thumbnail = Buffer.from(arrayBuffer);
    // }
  }

  const template = new Template("generic", {
    passTypeIdentifier: "pass.me.arturwdowiarski.first-pass",
    teamIdentifier: "Y23Q74DCEK",
    organizationName : "NFT 2 Wallet",
    foregroundColor : "rgb(255, 255, 255)",
    backgroundColor : "rgb(197, 31, 31)",
    description: "NFT 2 Wallet Pass",
    sharingProhibited: true,
    generic: {
      primaryFields : [
        {
          "key" : "name",
          "value" : nftName
        }
      ]
    }
  });
  template.barcodes = [
    {
    "message" : nft.token_address,
    "format" : "PKBarcodeFormatQR",
    "messageEncoding" : "iso-8859-1"
    }
  ]
  await template.images.add("icon", "./resources/passes/NFT.pass/icon.png")
  await template.images.add("logo", "./resources/passes/NFT.pass/logo.png")
  // if (thumbnail) {
  //   await template.images.add("thumbnail", thumbnail)
  // }

  await template.loadCertificate("./resources/cert/NFT2WalletSignerCert.pem", "nft2wallet");
  template.serialNumber = nft.token_address

  const pass = template.createPass();
  return pass
}
  
export  {};
