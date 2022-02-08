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
            <p>fetching the NFT</p>
          :
            this.state.cachedNFTMetaData ? 
              <div className="md:w-1/4 w-full mx-auto p-4 bg-slate-300 rounded-xl">
                <p className="text-slate-700">{this.state.cachedNFTMetaData?.name}</p>
                <p className="text-slate-700">{this.state.cachedNFTMetaData?.description}</p>
                <img src={this.getNFTImageURL()}/>
              </div>
            :
              <p> Couln&apos;t fetch the NFT </p>
          }
        </div>
      </div>
    );
  }
}