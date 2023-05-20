import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { toast } from 'sonner'
import metisVoteContract from "../../../contracts/deployments/metis/MetisVote.json"
import { useEffect } from "react"
import { parseToElection } from "@/types/metisVote"

export const useVoteContract = () => {
    const { address } = useAccount()

    useEffect(() => {
        refetchisAddressContractOwner();
    }, [address]);

    const { data: isAddressContractOwner, refetch: refetchisAddressContractOwner } = useContractRead({
        address: `0x${metisVoteContract.address.slice(2, metisVoteContract.address.length)}`,
        abi: metisVoteContract.abi,
        functionName: "owner"
    })

    const { data: electionIdCounter } = useContractRead({
        address: `0x${metisVoteContract.address.slice(2, metisVoteContract.address.length)}`,
        abi: metisVoteContract.abi,
        functionName: "_electionIdCounter"
    })

    const getElectionById = ({ electionId }: { electionId: number }) => {
        const { data: election } = useContractRead({
            address: `0x${metisVoteContract.address.slice(2, metisVoteContract.address.length)}`,
            abi: metisVoteContract.abi,
            functionName: "elections",
            args: [electionId],
            onError: (error) => {
                const moreThan80Chars = error.message.length > 80;
                toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
            },
        })

        if (!election) {
            return null
        }

        return parseToElection(election)
    }

    const getCandidatesById = ({ electionId }: { electionId: number }) => {
        const { data: election } = useContractRead({
            address: `0x${metisVoteContract.address.slice(2, metisVoteContract.address.length)}`,
            abi: metisVoteContract.abi,
            functionName: "candidates",
            args: [electionId],
            onError: (error) => {
                const moreThan80Chars = error.message.length > 80;
                toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
            },
        })

        if (!election) {
            return null
        }

        console.log()
    }

    const vote = ({ electionId, candidateAddress }: { electionId: number, candidateAddress: string }) => {
        return useContractRead({
            address: `0x${metisVoteContract.address.slice(2, metisVoteContract.address.length)}`,
            abi: metisVoteContract.abi,
            functionName: "vote",
            args: [electionId, candidateAddress, 0],
            onError: (error) => {
                const moreThan80Chars = error.message.length > 80;
                toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
            },
        })
    }

    return {
        electionIdCounter,
        isAddressContractOwner: isAddressContractOwner === address,
        getElectionById,
        getCandidatesById,
        vote
    }
}