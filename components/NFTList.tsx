import React from 'react';
import styles from '../styles/Home.module.css'
import { Moralis }  from "moralis";
import { NFT } from "../@types/types"
import { sendCreatePassRequest } from '../helpers/APICalls';
import { normaliseURL } from '../helpers/urlAPI';

type Props = {};
type State = {
  shouldFetchNFTs: boolean,
  nfts: NFT[]
  imageCashe: { [token_address: string]: string }
};

export class NFTList extends React.Component<Props, State> {
  state: Readonly<State> = {
    shouldFetchNFTs: true,
    nfts: [],
    imageCashe: {}
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
    results.result?.forEach(nft => {
      if (nft.token_uri) {
        fetch(nft.token_uri, {method: 'GET'})
        .then(response => {
          response.json().then(json => {
            const imageURL = json.image || json.image_url
            if (imageURL) {
              const newImageCache = this.state.imageCashe;
              newImageCache[nft.token_address] = normaliseURL(imageURL)
              this.setState({
                ...this.state,
                imageCashe: newImageCache
              })
            }
          })
        })
        .then(data => console.log(data))
        .catch(error => console.log(error));
      }
    });
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
        className="w-full hover:shadow-md hover:shadow-orange-300/50 bg-slate-200 p-2 rounded-xl font-sans font-light"
      >
      <div className="w-full rounded-xl shadow-inner bg-slate-300 mb-6">
      <img className="p-1 rounded-xl" id="nft_artwork" src={this.state.imageCashe[nft.token_address] || ""}></img>
      <div className="flex pt-4 pb-4 pl-2 items-center text-left text-xs text-slate-700 font-semibold font-sans">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
</svg>{nft.name}
        </div>
      </div>
        
        <div 
          className=""
          onClick={() => {
            this.sendCreateCouponRequest(nft)
          }}
        >
          <div className="p-4 bg-orange-300 hover:shadow-md cursor-pointer rounded-md text-slate-700 font-sans font-semibold">Send</div>
        </div>
      </div>
    );
  }

  render(): React.ReactNode {
    this.loadNFTsIfNeeed()
    return (
      <div className="w-full  p-2 md:w-2/3 mx-auto">
        <div className="uppercase bg-navy pt-2 sticky top-0 flex flex-wrap md:flex-nowrap items-start text-left text-slate-300 font-sans">
        <div className="text-sm p-2 md:p-0 text-center md:text-left">
        Choose the NFT you want to send to your phone via email
        </div>
        <div class="w-full mb-2 ml-2 p-2 rounded-md flex items-center border bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>
          <input className="w-full ml-2 p-2 rounded-md" placeholder="Your email address." type="text" id="email-input"/>
        </div></div>
        <div className="mt-4 grid gap-2 grid-cols-1 md:grid-cols-4">
          {this.state.shouldFetchNFTs ?
            <div 
            className="w-full hover:shadow-md hover:shadow-orange-300/50 bg-slate-200 p-2 rounded-xl font-sans font-light animate-pulse"
          >
          <div className="w-full rounded-xl shadow-inner bg-slate-300 mb-6 animate-pulse"> Fetching NFTs
          <img className="p-1 h-64 rounded-xl" id="nft_artwork"></img>
          <div className="flex pt-4 pb-4 pl-2 items-center text-left text-xs text-slate-700 font-semibold font-sans">
            </div>
          </div>
            <div>
              <div className="p-4 bg-slate-300 hover:shadow-md cursor-pointer rounded-md text-slate-700 font-sans font-semibold animate-pulse"></div>
            </div>
          </div>
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
