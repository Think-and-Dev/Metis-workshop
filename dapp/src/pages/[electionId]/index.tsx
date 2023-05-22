import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Card } from '@/components/Card'
import { CountDown } from '@/components/Countdown'
import { useVoteContract } from '@/hooks/useVoteContract'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

function MainPage() {
    const router = useRouter();
    const electionId = router.query.electionId ? parseInt(router.query.electionId as string) : 0;
    const [isVotationActive, setIsVotationActive] = useState(false)
    const { getElectionById, getCandidatesByElection } = useVoteContract();
    const election = getElectionById({ electionId: electionId })
    const candidates = getCandidatesByElection({ electionId: electionId })

    if (!election || candidates.length < 2) {
        router.replace('/')
    }

    return (
        <main
            className={`flex flex-col w-full h-full overflow-x-hidden items-center  justify-between p-24 ${inter.className}`}
        >
            <div className='flex w-full h-full justify-center items-center'>
                <div className='flex flex-row gap-48 justify-between'>
                    {
                        isVotationActive && candidates ? (<>
                            <Card electionId={electionId} candidateAddress={candidates[0]} candidateName='Stefan' imgSource='https://robohash.org/stefan-one' proposal={
                                "My opponent wants to build a wall, but I want to build a ball pit! Think about it: what's more fun than jumping into a sea of colorful plastic balls? Plus, it's a great way to relieve stress and promote physical activity. So let's put the 'fun' back in 'fundamental human rights' and build a ball pit for all!"
                            } />
                            <Card electionId={electionId} candidateAddress={candidates[1]} candidateName='George' imgSource='https://robohash.org/stefan-two' proposal={
                                "As your candidate, I promise to fight for the things that really matter, like making sure every day ends with a slice of cake. That's right, folks, under my leadership, dessert is not just for special occasions anymore! Let's have our cake and eat it too!"
                            } />
                        </>) : (
                            <CountDown epochTime={election?.startTime || 0} onFinishCounter={() => setIsVotationActive(true)} />
                        )
                    }
                </div>
            </div>
        </main>
    )
}

export default MainPage;