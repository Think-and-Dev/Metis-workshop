import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useSbtContract } from "@/hooks/useSbtContract";
import { useVoteContract } from "@/hooks/useVoteContract";
import { useEffect } from "react";
import { Loader } from "./Loader";
import { useRouter } from "next/router";

interface IVoteButton {
    electionId: number;
    candidateAddress: string;
    voteFor: string;
}

export const VoteButton = (props: IVoteButton) => {
    const router = useRouter();
    const { voteFor, electionId, candidateAddress } = props

    const { isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    const { userHasSbt, claimSbt, userSbtTokenId } = useSbtContract();
    const { vote, registerVoter, alreadyRegisteredAsVoter, refetchAlreadyAVoter } = useVoteContract({ electionId });

    useEffect(() => {
        if (registerVoter.isSuccess) {
            refetchAlreadyAVoter();
        }

        if (vote.isSuccess) {
            setTimeout(() => {
                router.push(`/${electionId}/stats/`)
            }, 1000);
        }
    }, [registerVoter.isSuccess, vote.isSuccess]);


    const handleClick = async () => {
        if (!isConnected) {
            connect();
            return;
        }

        if (!alreadyRegisteredAsVoter && userHasSbt && userSbtTokenId) {
            registerVoter.write({
                args: [userSbtTokenId]
            })
        }

        if (alreadyRegisteredAsVoter && userHasSbt && userSbtTokenId) {
            vote.write({
                args: [electionId, candidateAddress]
            });
        }
    }

    return <>
        {
            <div>
                {
                    isConnected &&
                    <label htmlFor={!userHasSbt ? 'my-modal-3' : ''} className="btn btn-outline rounded-md text-black" onClick={handleClick}>
                        {
                            claimSbt.isLoading || registerVoter.isLoading || vote.isLoading ? <Loader /> : alreadyRegisteredAsVoter ?
                                <>Vote for {voteFor}</> : "Register as voter"
                        }
                    </label >
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
            </div>
        }
    </>
}