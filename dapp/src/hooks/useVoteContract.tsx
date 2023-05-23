import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { toast } from 'sonner'
import { METIS_VOTE_ADDRESS } from "./constants"
import metisVoteContract from "../../../contracts/deployments/metis/MetisVote.json"
import { useEffect } from "react"
import { parseToCandidates, parseToElection } from "@/types/metisVote"

export const useVoteContract = ({ electionId }: { electionId?: number }) => {
    const { address } = useAccount()

    useEffect(() => {
        refetchisAddressContractOwner();
    }, [address]);

    const { data: isAddressContractOwner, refetch: refetchisAddressContractOwner } = useContractRead({
        address: `0x${METIS_VOTE_ADDRESS}`,
        abi: metisVoteContract.abi,
        functionName: "owner"
    })

    const { data: electionIdCounter } = useContractRead({
        address: `0x${METIS_VOTE_ADDRESS}`,
        abi: metisVoteContract.abi,
        functionName: "_electionIdCounter"
    })

    const { data: alreadyAVoter, refetch: refetchAlreadyAVoter } = useContractRead({
        address: `0x${METIS_VOTE_ADDRESS}`,
        abi: metisVoteContract.abi,
        enabled: !!address,
        args: [address],
        functionName: "voters"
    })

    const isElectionActive = useContractRead({
        address: `0x${METIS_VOTE_ADDRESS}`,
        abi: metisVoteContract.abi,
        functionName: "isActiveElection",
        enabled: !!electionId,
        args: [electionId],
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
    });

    const election = useContractRead({
        address: `0x${METIS_VOTE_ADDRESS}`,
        abi: metisVoteContract.abi,
        functionName: "elections",
        enabled: !!electionId,
        args: [electionId],
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
    })

    const candidates = useContractRead({
        address: `0x${METIS_VOTE_ADDRESS}`,
        abi: metisVoteContract.abi,
        functionName: 'getCandidatesByElection',
        enabled: !!electionId,
        args: [electionId],
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
    })

    const getCandidateVotes = ({ electionId, candidateAddress }: { electionId: number, candidateAddress: string }): number => {
        const { data: candidateVotes } = useContractRead({
            address: `0x${METIS_VOTE_ADDRESS}`,
            abi: metisVoteContract.abi,
            functionName: 'getCandidateVotes',
            enabled: !!electionId && !!candidateAddress,
            args: [electionId, candidateAddress],
            onError: (error) => {
                const moreThan80Chars = error.message.length > 80;
                toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
            },
        })

        return Number(candidateVotes)
    }

    const vote = useContractWrite({
        address: `0x${METIS_VOTE_ADDRESS}`,
        abi: metisVoteContract.abi,
        functionName: "vote",
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
        onSuccess: () => {
            toast.success("Vote submitted successfully!");
        }
    })

    const registerVoter = useContractWrite({
        address: `0x${METIS_VOTE_ADDRESS}`,
        abi: metisVoteContract.abi,
        functionName: "registerVoter",
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
        onSuccess: () => {
            toast.success("Voter Registered!");
        }
    })

    return {
        electionIdCounter,
        election: parseToElection(election.data),
        candidates: parseToCandidates(candidates.data || []),
        alreadyRegisteredAsVoter: alreadyAVoter ? true : false,
        refetchAlreadyAVoter,
        isAddressContractOwner: isAddressContractOwner === address,
        isElectionActive,
        vote,
        registerVoter,
        getCandidateVotes
    }
}

