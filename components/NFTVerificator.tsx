import React from 'react';
import styles from '../styles/Home.module.css'
import { Moralis }  from "moralis";
import { NFT } from "../@types/types"
import { normaliseURL } from '../helpers/urlAPI';

type Props = {};
type State = {
  shouldFetchTheNFT: boolean,
  nft: NFT | null,
  cachedImageURL: string | null
};

export class NFTVerificator extends React.Component<Props, State> {
  state: Readonly<State> = {
    shouldFetchTheNFT: true,
    nft: null,
    cachedImageURL: null
  }

  async loadTheNFTIfNeeded() {
    if (!this.state.shouldFetchTheNFT) {
      return
    }

    // TODO: Get the chain, NFT's address and wallet address from the hash/query params (I don't know yet how we'll do that)
    // FIXME: Verify that the hash/params were signed with the private key of the NFT owner
    const chain: "polygon" | "eth" = "polygon"
    const options = {
      chain: chain,
      address: "0x216f927a2f13CE1ab8ea00d6377dCd51Ce2E6f23",
      token_addresses: ["0x72b6dc1003e154ac71c76d3795a3829cfd5e33b9"]

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
        response.json().then(json => {
          const imageURL = json.image || json.image_url
          if (imageURL) {
            this.setState({
              ...this.state,
              cachedImageURL: normaliseURL(imageURL)
            })
          }
        })
      })
      .then(data => console.log(data))
      .catch(error => console.log(error));
      }
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
              <img src={this.state.cachedImageURL || ""}/>
            </div>
          :
            <p> Couln't fetch the NFT </p>
        }
      </div>
    );
  }
}