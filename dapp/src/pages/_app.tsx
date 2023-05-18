import { Layout } from '@/components/Layout'
import Image from 'next/image'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createConfig } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { metisGoerli } from 'viem/chains'
import ClientRehydration from '@/utils/ClientRehydration'
import { Toaster } from 'sonner'

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: metisGoerli,
    transport: http()
  }),
})

export default function App({ Component, pageProps }: AppProps) {
  return <ClientRehydration>
    <WagmiConfig config={config}>
      <Toaster position="top-right" richColors />
      <Image src={'/bg.png'} alt="background" fill />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WagmiConfig>
  </ClientRehydration>
}
