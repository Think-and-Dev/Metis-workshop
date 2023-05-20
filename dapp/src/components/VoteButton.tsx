import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useSbtContract } from "@/hooks/useSbtContract";
import { useVoteContract } from "@/hooks/useVoteContract";

interface IVoteButton {
    electionId: number
    voteFor: string;
}

export const VoteButton = (props: IVoteButton) => {
    const { isConnected } = useAccount()
    const { userHasSbt, claimSbt } = useSbtContract();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { vote } = useVoteContract();


    //burned candidates
    const candidateA = "0x17e7c0140C059883Ee73aD8b42943f58153582EA";
    const candidateB = "0x23e335f403C4B8f23ADC86C85d4ff7d1d4bA00bb";

    const { voteFor, electionId } = props;

    const handleClick = async () => {
        if (!isConnected) {
            connect();
            return;
        }

        if (userHasSbt) {
            const response = vote.refetch()
            console.log(response)
        }
    }

    //TODO: Verify if user has already voted
    return <>
        {
            false ? (<button className="btn btn-outline rounded-md" disabled={true}>You already voted</button>) : (
                <>
                    {
                        isConnected && <label htmlFor={!userHasSbt ? 'my-modal-3' : ''} className="btn btn-outline rounded-md" onClick={handleClick}> Vote for {voteFor}</label >
                    }
                    {
                        !userHasSbt && (
                            <>
                                <input type="checkbox" id={!userHasSbt ? 'my-modal-3' : ''} className="modal-toggle" />
                                <div className="modal">
                                    <div className="modal-box relative text-center">
                                        <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                                        <h3 className="text-lg font-bold">Mint a SBT token</h3>
                                        <p className="py-4">You need a SBT token in order to be able to vote for {voteFor}</p>
                                        <button disabled={claimSbt.isLoading} onClick={() => claimSbt.write()} className="btn rounded-md">MINT SBT</button>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </>
            )
        }
    </>
}