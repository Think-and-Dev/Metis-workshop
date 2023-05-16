import { Inter } from 'next/font/google'
import { Card } from '@/components/Card'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex flex-col w-full h-screen items-center  justify-between p-24 ${inter.className}`}
    >
      <div className='flex w-full h-full justify-center items-center'>
        <div className='flex flex-row gap-48 justify-between'>
          <Card candidateName='Stefan' imgSource='https://robohash.org/stefan-one' proposal={
            "My opponent wants to build a wall, but I want to build a ball pit! Think about it: what's more fun than jumping into a sea of colorful plastic balls? Plus, it's a great way to relieve stress and promote physical activity. So let's put the 'fun' back in 'fundamental human rights' and build a ball pit for all!"
          } />
          <Card candidateName='George' imgSource='https://robohash.org/stefan-two' proposal={
            "As your candidate, I promise to fight for the things that really matter, like making sure every day ends with a slice of cake. That's right, folks, under my leadership, dessert is not just for special occasions anymore! Let's have our cake and eat it too!"
          } />
        </div>
      </div>
    </main>
  )
}
