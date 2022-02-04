import React from 'react';
import styles from '../styles/Home.module.css'
import { Moralis }  from "moralis";
import { NFT } from "../@types/types"

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

  renderNFT(nft: NFT) {
    return (
      <div 
        className={styles.card}
      >
        <p>
          name: {nft.name}
        </p>
      </div>
    );
  }

  render(): React.ReactNode {
    this.loadNFTsIfNeeed()
    return (
      <div>
        <h1 className={styles.title}>
          Your NFTs
        </h1>
        <div className={styles.grid}>
          {this.state.shouldFetchNFTs ?
            "Loading..."
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
