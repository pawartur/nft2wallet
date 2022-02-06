import { NFT } from "../@types/types";
import { Moralis }  from "moralis";

export async function fetchNFT(
  walletAddress: string,
  tokenAddress: string ,
  tokenId: string,
): Promise<NFT | undefined> {
  const chain: "polygon" | "eth" = "polygon"
  const options = {
    chain: chain,
    address: walletAddress,
    tokenAddress: [tokenAddress]
  }
  const results = await Moralis.Web3API.account.getNFTs(options)
  const requestedNFT = results.result?.find(nft => {
    return (nft.token_address === tokenAddress && nft.token_id === tokenId)
  })
  return requestedNFT
}
