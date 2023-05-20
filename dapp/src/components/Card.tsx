import { VoteButton } from "./VoteButton";

interface ICard {
    candidateName: string;
    imgSource: string;
    proposal: string;
    electionId: number;
}

export const Card = (cardProps: ICard) => {
    const { candidateName, imgSource, proposal, electionId } = cardProps;

    return <div className="flex flex-col justify-center items-center">
        <div className="relative flex flex-col justify-between items-center rounded-[20px] w-[500px] h-[600px] mx-auto p-4 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
            <div className="relative flex h-48 w-full justify-center rounded-xl bg-cover" >
                <img src='https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png' className="absolute flex  h-48 w-full justify-center rounded-xl bg-cover" />
                <div className="absolute -bottom-12 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                    <img className="h-full w-full rounded-full" src={imgSource} alt="" />
                </div>
            </div>
            <div className="mt-16 flex flex-col items-center">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    {candidateName}
                </h4>
                <p className="text-base font-normal text-gray-600">Product Manager</p>
            </div>
            <div className="text-center text-gray-500 mt-6 mb-3 flex gap-14 md:!gap-14 px-3">
                <p>{proposal}</p>
            </div>
            <VoteButton voteFor={candidateName} electionId={electionId} />
        </div>
    </div>
}