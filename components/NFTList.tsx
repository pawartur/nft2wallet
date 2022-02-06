import React from 'react';
import styles from '../styles/Home.module.css'
import { Moralis }  from "moralis";
import { NFT, NFTMetaData } from "../@types/types"
import { sendCreatePassRequest } from '../helpers/APICalls';
import { normaliseURL } from '../helpers/urlAPI';
import { validateEmail } from '../helpers/emailAPI';

type Props = {
  absoluteURL: string
};

type State = {
  shouldFetchNFTs: boolean,
  nfts: NFT[]
  nftsMetaData: { [token_address: string]: NFTMetaData }
};

export class NFTList extends React.Component<Props, State> {
  state: Readonly<State> = {
    shouldFetchNFTs: true,
    nfts: [],
    nftsMetaData: {}
  }

  async loadNFTsIfNeeed() {
    if (!this.state.shouldFetchNFTs) {
      return
    }
    const chain: "polygon" | "eth" = "polygon"
    const walletAddress = Moralis.User.current()?.attributes.accounts[0] || ""
    const options = {
      chain: chain,
      address: walletAddress
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
          response.json().then((nftMetaData: NFTMetaData) => {
            const newNFTsMetaData = this.state.nftsMetaData;
            newNFTsMetaData[nft.token_address] = nftMetaData
              this.setState({
                ...this.state,
                nftsMetaData: newNFTsMetaData
              })
          })
        })
        .then(data => console.log(data))
        .catch(error => console.log(error));
      }
    });
  }

  sendCreateCouponRequest(nft: NFT) {
    const walletAddress = Moralis.User.current()?.attributes.accounts[0] || ""
    const emailAddress = (document.getElementById('email-input') as HTMLInputElement).value
    if (validateEmail(emailAddress)) {
      const progressIndicator = document.getElementById('action-in-progress')
      if (progressIndicator) {
        progressIndicator.style.display = "block"
      }
      sendCreatePassRequest(
        this.props.absoluteURL,
        walletAddress,
        emailAddress, 
        nft
      ).then(response => {
        if (progressIndicator) {
          progressIndicator.style.display = "none"
        }
        if (response.status === 200) {
          const confirmBox = document.getElementById('action-confirm')
          if (confirmBox) {
            confirmBox.style.display = "block"
          }
        } else {
          // TODO: Show error
        }
      })
    } else {
      this.showEmailInputError("Please, enter a valid email address")
    }
  }

  showEmailInputError(errorMessage: string) {
    const errorLabel = document.getElementById('error-info')
    if (errorLabel) {
      errorLabel.innerHTML = errorMessage
    }
  }

  clearErrors() {
    const errorLabel = document.getElementById('error-info')
    if (errorLabel) {
      errorLabel.innerHTML = ""
    }
  }

  getNFTImageURL(nft: NFT): string {
    const metaData = this.state.nftsMetaData[nft.token_address]
    if (metaData) {
      return normaliseURL(metaData.image_url || metaData.image || "")
    } else {
      return ""
    }
  }

  renderNFT(nft: NFT) {
    return (
      <div 
        className="w-full hover:shadow-md hover:shadow-orange-300/50 bg-slate-200 p-2 rounded-xl font-sans font-light"
      >
      <div className="w-full h-4/5 rounded-xl shadow-inner bg-slate-300 mb-6">
      <img className="p-1 h-4/5 w-full object-cover rounded-xl" id="nft_artwork" src={this.getNFTImageURL(nft)}></img>
      <div className="flex pt-4 pb-4 pl-2 items-center text-left text-xs text-slate-700 font-semibold font-sans">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
</svg>{this.state.nftsMetaData[nft.token_address]?.name}
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
        <div className="w-full mb-2 ml-2 p-2 rounded-md flex items-center border bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>
          <input 
            className="w-full ml-2 p-2 rounded-md text-slate-700" 
            placeholder="Your email address." 
            type="text" 
            id="email-input"
            onChange={() => {
              this.clearErrors()
            }}
          />
        </div>
        <p id="error-info"></p>
        </div>
        <div className="mt-4 grid gap-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
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
        <div className="w-full bg-white" id="action-in-progress" style={{display: 'none' }}>This is a wating element/info box after user clicks on "send"</div>
        <div className="w-full bg-white" id="action-confirm" style={{display: 'none' }}>This is a wating element/info box after request is completed</div>
      </div>
    );
  }
}
