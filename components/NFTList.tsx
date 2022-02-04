import React from 'react';
import styles from '../styles/Home.module.css'
import { Moralis }  from "moralis";
import { NFT } from "../@types/types"
import { sendCreatePassRequest } from '../helpers/APICalls';

type Props = {};
type State = {
  shouldFetchNFTs: boolean,
  nfts: NFT[]
};

export class NFTList extends React.Component<Props, State> {
  state: Readonly<State> = {
    shouldFetchNFTs: true,
    nfts: []
  }

  async loadNFTsIfNeeed() {
    if (!this.state.shouldFetchNFTs) {
      return
    }
    const chain: "polygon" | "eth" = "polygon"
    // FIXME: Get address from the currently logged in metamask wallet, don't hard-code it
    const options = {
      chain: chain,
      address: "0x216f927a2f13CE1ab8ea00d6377dCd51Ce2E6f23"
    }
    const results = await Moralis.Web3API.account.getNFTs(options)
    this.setState({
      shouldFetchNFTs: false,
      nfts: results.result || []
    })
  }

  sendCreateCouponRequest(nft: NFT) {
    const emailAddress = (document.getElementById('email-input') as HTMLInputElement).value
    console.log(emailAddress)
    // TODO: Validate the email address
    sendCreatePassRequest(emailAddress, nft) 
  }

  renderNFT(nft: NFT) {
    return (
      <div 
        className="w-1/4 hover:shadow-md hover:shadow-orange-300/50 bg-slate-200 p-6 rounded-xl font-sans font-light"
      >
      <div className="w-full h-64 rounded-xl shadow-inner bg-orange-200">Artwork placeholder</div>
        <div className="flex p-2 items-center text-left text-slate-700 text-sm font-semibold font-sans">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
</svg>{nft.name}
        </div>
        <div 
          className=""
          onClick={() => {
            this.sendCreateCouponRequest(nft)
          }}
        >
          <div className="p-4 bg-orange-300 hover:shadow-md cursor-pointer rounded-md text-slate-700">Send</div>
        </div>
      </div>
    );
  }

  render(): React.ReactNode {
    this.loadNFTsIfNeeed()
    return (
      <div className="w-full p-2 md:w-2/3 mx-auto">
        <h1 className="uppercase text-left text-slate-300 font-sans">
          Your NFTs:
        </h1>
        <div>
          <p className={styles.description}>
            Choose the NFT you want to send to your phone via email
          </p>
          <p>
            Enter your Email Address: <input type="text" id="email-input"/>
          </p>
        </div>
        <div className="flex items-start space-x-1 md:space-x-4 mt-4">
          {this.state.shouldFetchNFTs ?
            <div className="text-slate-300 w-1/2 mx-auto flex items-center justify-center"><div class="animate-bounce mr-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg></div> <div>Loading...</div></div>
            :
            this.state.nfts.length > 0 ?
              this.state.nfts.map(nft =>
                this.renderNFT(nft)
              )
              : "No NFTs" 
          }
        </div>
      </div>
    );
  }
}
