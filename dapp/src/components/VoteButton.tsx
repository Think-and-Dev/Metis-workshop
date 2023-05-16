import { web3AuthContext } from "@/contexts/web3AuthContext";
import { IWeb3AuthContext } from "@/types/contexts/IWeb3AuthContext";
import { useContext, useState } from "react";

interface IVoteButton {
    voteFor: string;
}

export const VoteButton = (props: IVoteButton) => {
    const [hasSbt, setHasSbt] = useState<boolean>(false);
    const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false);
    const { voteFor } = props;
    const { publicKey, login, isWeb3AuthInit } = useContext(web3AuthContext) as IWeb3AuthContext;

    const handleClick = async () => {
        if (!publicKey) {
            login();
            return;
        }

        if (!hasSbt) {
            return
        }

        alert('Voted for ' + voteFor)
        setAlreadyVoted(true)
    }

    const handleMintSbt = async () => {
        alert('SBT MINTED')
        setHasSbt(true)
    }

    return <>
        {
            alreadyVoted ? (<button className="btn btn-outline rounded-md" disabled={true}>You already voted</button>) : (
                <>
                    {
                        isWeb3AuthInit && <label htmlFor={!hasSbt ? 'my-modal-3' : ''} className="btn btn-outline rounded-md" onClick={handleClick}> Vote for {voteFor}</label >
                    }
                    <input type="checkbox" id={!hasSbt ? 'my-modal-3' : ''} className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box relative text-center">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                            <h3 className="text-lg font-bold">Mint a SBT token</h3>
                            <p className="py-4">You need a SBT token in order to be able to vote for {voteFor}</p>
                            <button onClick={handleMintSbt} className="btn rounded-md">MINT SBT</button>
                        </div>
                    </div>
                </>
            )
        }
    </>
}