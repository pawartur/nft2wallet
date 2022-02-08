import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { NFTVerificator } from '../../components/NFTVerificator';
import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'


// router.query is empty, if there's no getServerSideProps: https://nextjs.org/docs/advanced-features/automatic-static-optimization
export async function getServerSideProps(context: any) {
  return {props:{}}
}

export default function VerificationPage() {
const { width, height } = useWindowSize()
const router = useRouter()
console.log('QUERY')
console.log(router.query)
  
  return (
    <div className="w-full bg-navy">
      <Head>
        <title>NFT2AppleWallet</title>
        <meta name="description" content="NFT to Apple Wallet - Verify Your NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <main className="p-2 bg-navy w-full min-h-full text-center font-outfit">
      <div className="w-full h-48 flex items-center justify-between md:p-6">
<div><img src="/img/NFT2walletLogo.png" className="h-24 md:h-36"></img></div>


  <div className="text-slate-300 font-sans font-semibold p-3 md:p-4 text-xs md:text-md uppercase flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
</svg> secure pass verification</div>
             

      </div>
      <div>
          {/* TODO: Validate the query params */}
          <NFTVerificator
            walletAddress={router.query.walletAddress as string}
            tokenAddress={router.query.tokenAddress as string}
            tokenId={router.query.tokenId as string}
            windowHeight={height}
            windowWidth={width}
          />
        </div>
        
       
         
      </main>

     <div className="w-full p-6 flex items-center justify-center text-slate-300 font-sans font-light">
        
        <div className=""> Made with</div> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 p-1 text-red-600" viewBox="0 0 20 20" fill="currentColor">
 <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
</svg> for ETHGlobal Hackathon
       
     </div>
   </div>
  )
}
