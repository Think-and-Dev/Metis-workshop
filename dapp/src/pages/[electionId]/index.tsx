import { Inter } from 'next/font/google'
import { Card } from '@/components/Card'
import { CountDown } from '@/components/Countdown'
import { useVoteContract } from '@/hooks/useVoteContract'
import { useRouter } from 'next/router'
import { useSbtContract } from '@/hooks/useSbtContract'

const inter = Inter({ subsets: ['latin'] })

function MainPage() {
    const router = useRouter();
    const electionId = router.query.electionId ? parseInt(router.query.electionId as string) : 0;
    const { election, candidates, isElectionActive } = useVoteContract({ electionId });
    const { userAlreadyVote, userSbtTokenId } = useSbtContract();

    return (
        <main
            className={`flex flex-col w-full h-full overflow-x-hidden items-center  justify-between p-24 ${inter.className}`}
        >
            {
                userAlreadyVote({ electionId, userSbtTokenId }) ?
                    <div className="relative  min-h-12  bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl" style={{ width: "600px" }}>
                        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                            <div className="flex flex-col items-center justify-center text-center space-y-2">
                                <div className="font-semibold text-3xl">
                                    <p>Oops! You already voted 👀</p>
                                </div>

                                <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                    <p>You can check the results in the following link!</p>
                                </div>
                            </div>

                            <button className="flex items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm" onClick={() => router.push(`/${electionId}/stats/`)}>
                                Go to stadistics
                            </button>
                        </div>
                    </div>
                    : (
                        <div className='flex w-full h-full justify-center items-center'>
                            <div className='flex flex-row gap-48 justify-between'>
                                {
                                    isElectionActive?.data ? (
                                        <>
                                            <Card electionId={electionId} candidateAddress={candidates[0]} candidateName='Stefan' imgSource='https://robohash.org/stefan-one' proposal={
                                                "My opponent wants to build a wall, but I want to build a ball pit! Think about it: what's more fun than jumping into a sea of colorful plastic balls? Plus, it's a great way to relieve stress and promote physical activity. So let's put the 'fun' back in 'fundamental human rights' and build a ball pit for all!"
                                            } />
                                            <Card electionId={electionId} candidateAddress={candidates[1]} candidateName='George' imgSource='https://robohash.org/stefan-two' proposal={
                                                "As your candidate, I promise to fight for the things that really matter, like making sure every day ends with a slice of cake. That's right, folks, under my leadership, dessert is not just for special occasions anymore! Let's have our cake and eat it too!"
                                            } />
                                        </>) : (
                                        <CountDown epochTime={election?.startTime || 0} onFinishCounter={() => isElectionActive.refetch()} />
                                    )
                                }
                            </div>
                        </div>
                    )
            }
        </main>
    )
}

export default MainPage;