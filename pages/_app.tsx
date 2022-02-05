import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";
import { Moralis }  from "moralis";

function MyApp({ Component, pageProps }: AppProps) {
  Moralis.start({
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || "",
    appId:process.env.NEXT_PUBLIC_APP_ID || ""
  })
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_APP_ID || ""}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL || ""}
      initializeOnMount={true}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}
export default MyApp;