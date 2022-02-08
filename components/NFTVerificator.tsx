import React from 'react';
import { NFT, NFTMetaData } from "../@types/types"
import { normaliseURL } from '../helpers/urlAPI';
import { fetchNFT } from "../helpers/NFTAPI";
import Confetti from 'react-confetti'

type Props = {
  walletAddress: string,
  tokenAddress: string,
  tokenId: string,
  windowWidth: number,
  windowHeight: number
};
type State = {
  isLoadingNFT: boolean,
  nft: NFT | null,
  cachedNFTMetaData: NFTMetaData | null,
  addConfetti: boolean
};

export class NFTVerificator extends React.Component<Props, State> {
  state: Readonly<State> = {
    isLoadingNFT: true,
    nft: null,
    cachedNFTMetaData: null,
    addConfetti: false
  }

  componentDidMount() {
    // TODO: Verify that the hash/params were signed with the private key of the NFT owner
    fetchNFT(
      this.props.walletAddress,
      this.props.tokenAddress,
      this.props.tokenId
    ).then(nft => {
      this.setState({
        isLoadingNFT: false,
        nft: nft || null,
        addConfetti: true
      })
  
      if (nft?.token_uri) {
        fetch(nft.token_uri, {method: 'GET'})
        .then(response => {
          response.json().then((nftMetadata: NFTMetaData) => {
            this.setState({
              ...this.state,
              cachedNFTMetaData: nftMetadata
            })
          })
        })
        .then(data => console.log(data))
        .catch(error => console.log(error));
      }
    })
  }

  getNFTImageURL(): string {
    return normaliseURL(this.state.cachedNFTMetaData?.image_url || this.state.cachedNFTMetaData?.image || "")
  }

  render(): React.ReactNode {
    return (
      <div>
        {this.state.addConfetti ? 
          <Confetti
            numberOfPieces={1000}
            width={this.props.windowWidth}
            height={this.props.windowHeight}
          />
          : <div></div>
        }
        <div className="w-full min-h-screen text-slate-300 font-sans font-semibold">
          {this.state.isLoadingNFT ? 
            <div className="w-full flex items-center justify-center"><div className="animate-spin"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg></div> Fetching the NFT... </div>
          :
            this.state.cachedNFTMetaData ? 
              <div className="md:w-1/4 w-full mx-auto p-4 bg-slate-300 rounded-xl">
                <p className="text-slate-700">{this.state.cachedNFTMetaData?.name}</p>
                <p className="text-slate-700">{this.state.cachedNFTMetaData?.description}</p>
                <img src={this.getNFTImageURL()}/>
              </div>
            :
              <div className="flex items-center"><div className="animate-spin"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg></div> Loading NFT from the wallet address... </div>
          }
        </div>
      </div>
    );
  }
}