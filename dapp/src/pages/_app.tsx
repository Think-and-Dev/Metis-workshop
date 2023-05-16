import { Layout } from '@/components/Layout'
import Image from 'next/image'
import { Web3AuthProvider } from '@/contexts/web3AuthContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Web3AuthProvider web3AuthNetwork={'testnet'} chain={'metis_testnet'}>
    <Image src={'/bg.png'} alt="background" fill />
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </Web3AuthProvider >
}
