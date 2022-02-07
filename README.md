This is a Next.js frontend + backend app that lets you:
1. Log in to you MetaMask Wallet
2. List the NFTs that you own on Polygon
3. Have the NFTs sent to your email address as Apple Wallet Coupons
4. Scan the coupons from your Apple Wallet to verify them in this app

In order to run this app you have to:
a. Install ImageMagick in your env
b. Put the certificate required to generate Apple Wallet passes, signed with your private key, in `/resources/cert/NFT2WalletSignerCert.pem` (see [tynovyatkin/pass-js](https://github.com/tinovyatkin/pass-js) for more details)

License:
NFT2Wallet is [MIT Licensed](https://github.com/pawartur/nft2wallet/blob/main/LICENSE)
