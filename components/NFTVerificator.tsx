import React from 'react';
import styles from '../styles/Home.module.css'
import { Moralis }  from "moralis";
import { NFT, NFTMetaData } from "../@types/types"
import { normaliseURL } from '../helpers/urlAPI';

type Props = {
  walletAddress: string,
  tokenAddress: string
};
type State = {
  shouldFetchTheNFT: boolean,
  nft: NFT | null,
  cachedNFTMetaData: NFTMetaData | null
};

export class NFTVerificator extends React.Component<Props, State> {
  state: Readonly<State> = {
    shouldFetchTheNFT: true,
    nft: null,
    cachedNFTMetaData: null
  }

  async loadTheNFTIfNeeded() {
    if (!this.state.shouldFetchTheNFT) {
      return
    }

    // TODO: Verify the wallet address and token address params
    // FIXME: Verify that the hash/params were signed with the private key of the NFT owner
    const chain: "polygon" | "eth" = "polygon"
    const options = {
      chain: chain,
      address: this.props.walletAddress,
      token_addresses: [this.props.tokenAddress]

    }

    const results = await Moralis.Web3API.account.getNFTs(options)
    const nft = results.result?.[0] || null
    this.setState({
      shouldFetchTheNFT: false,
      nft: results.result?.[0] || null
    })

    // TODO: move the code fetching NFT images to a helper function
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
  }

  getNFTImageURL(): string {
    return normaliseURL(this.state.cachedNFTMetaData?.image_url || this.state.cachedNFTMetaData?.image || "")
  }

  render(): React.ReactNode {
    this.loadTheNFTIfNeeded()
    return (
      <div className="w-full min-h-screen text-slate-300 font-sans font-semibold">
        {this.state.shouldFetchTheNFT ? 
          <p>fetching the NFT</p>
        :
          this.state.nft ? 
            <div className="md:w-1/4 w-full mx-auto p-4 bg-slate-300 rounded-xl">
              <p className="text-slate-700">{this.state.nft?.name}</p>
              <img src={this.getNFTImageURL()}/>
            </div>
          :
            <p> Couln&apos;t fetch the NFT </p>
        }
      </div>
    );
  }
}