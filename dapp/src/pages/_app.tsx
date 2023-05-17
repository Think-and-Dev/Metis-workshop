import { Layout } from '@/components/Layout'
import Image from 'next/image'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Image src={'/bg.png'} alt="background" fill />
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>
}
