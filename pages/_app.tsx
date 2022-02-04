import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
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