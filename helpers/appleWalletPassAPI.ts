const { Template } = require("@walletpass/pass-js");
import path from 'path'
import { NFT } from '../@types/types'

export async function generatePass(nft: NFT): Promise<any> {
  // FIXME: Don't store the cert in the repo in the final product ;P 
  const dir = path.resolve('./resources');
  const template = await Template.load("./resources/passes/Lollipop.pass");
  await template.loadCertificate("./resources/cert/NFT2WalletSignerCert.pem", "nft2wallet");
  
  template.serialNumber = nft.token_address
  template.barcodes = [
    {
    "message" : nft.token_address,
    "format" : "PKBarcodeFormatQR",
    "messageEncoding" : "iso-8859-1"
    }
  ]
  template.description = nft.name

  const pass = template.createPass();
  return pass
}
  
export  {};
