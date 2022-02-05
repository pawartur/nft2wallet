import type { NextPage } from 'next'
import Head from 'next/head'
import { useMoralis } from 'react-moralis'
import { NFTVerificator } from '../../components/NFTVerificator';
import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const Home: NextPage = () => {
const { isAuthenticated, authenticate, logout } = useMoralis();
const { width, height } = useWindowSize()
  
  return (
    <div className="w-full bg-navy">
      <Head>
        <title>NFT2AppleWallet</title>
        <meta name="description" content="NFT to Apple Wallet - Verify Your NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <main className="p-2 bg-navy w-full min-h-full text-center font-outfit">
      <Confetti
      numberOfPieces="100"
      width={width}
      height={height}
    />
      <div className="w-full h-48 flex items-center justify-between md:p-6">
<div><img src="/img/NFT2walletLogo.png" className="h-36"></img></div>

{
  isAuthenticated ?
 <div 
                className=""
                onClick={() => {
                  logout()
                  .then(function () {
                    console.log("logged out");
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                } 
                }
              >
                <div className="text-slate-700 cursor-pointer font-sans font-semibold p-3 md:p-4 bg-orange-300 text-xs md:text-md rounded-md">Sign Out From MetaMask </div>
              </div> 
              :
              <div className="text-slate-300 font-sans">You are logged out</div>
}
      </div>
        
        
        {isAuthenticated ? 
        <div>
          {/* Put the component with verified NFT details */}
          <NFTVerificator/>
        </div>
          : 
          <div>
            <p className="text-xl text-slate-300 font-sans font-light">
              Your Metamask wallet, to verify the NFT
            </p>
            <div className="">
              <div 
                className=""
                onClick={() => {
                  authenticate({ signingMessage: "Authorize linking of your wallet" })
                  .then(function (user) {
                    console.log("logged in user:", user);
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                } 
                }
              >
                <div className="p-6 mb-10 mt-10 cursor-pointer bg-orange-300 w-full md:w-1/3 rounded-md hover:text-green-700 mx-auto font-sans font-bold uppercase text-slate-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
</svg>connect metamask wallet</div>
              </div>
            </div>
            <div className="mx-auto w-full md:w-1/2 flex md:flex-nowrap flex-wrap space-x-4 items-center justify-center">
        <div className="bg-slate-200 text-slate-600 p-6 rounded-2xl text-center font-sans">
        <svg xmlns="http://www.w3.org/2000/svg" className="m-2 w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-radio"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
          <div className="font-bold">Ticket</div>NFC or QRCode to use your NFT as a pass or a ticket</div>
          <img src="/img/hero@2x.png" className="mx-auto w-64"></img>
          <div className="bg-slate-200 text-slate-600 p-6 rounded-2xl text-center font-sans">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <div className="font-bold">Digital ID</div>Use your NFT as an ID or a gift card in the real world</div>

        </div>
          </div>
        }
         
      </main>

     <div className="w-full p-6 flex items-center justify-center text-slate-300 font-sans font-light">
        
        <div className=""> Made with</div> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 p-1 text-red-600" viewBox="0 0 20 20" fill="currentColor">
 <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
</svg> for ETHGlobal Hackathon
       
     </div>
   </div>
  )
}

export default Home