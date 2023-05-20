import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { toast } from 'sonner'
import metisVoteContract from "../../../contracts/deployments/metis/MetisVote.json"
import { useEffect } from "react"
import { parseToElection } from "@/types/metisVote"

export const useVoteContract = () => {
    const { address } = useAccount()

    //burned candidates
    const candidateA = "0x17e7c0140C059883Ee73aD8b42943f58153582EA";
    const candidateB = "0x23e335f403C4B8f23ADC86C85d4ff7d1d4bA00bb";

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
        functionName: "_electionIdCounter",
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
        staleTime: 5000,
        cacheTime: 5000,
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
        const { data: candidates } = useContractRead({
            address: `0x${metisVoteContract.address.slice(2, metisVoteContract.address.length)}`,
            abi: metisVoteContract.abi,
            functionName: "candidatesArray",
            args: [electionId,],
            onError: (error) => {
                const moreThan80Chars = error.message.length > 80;
                toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
            },
        })

        if (!candidates) {
            return null
        }
    }


    const vote = useContractRead({
        address: `0x${metisVoteContract.address.slice(2, metisVoteContract.address.length)}`,
        abi: metisVoteContract.abi,
        functionName: "vote",
        args: [1, candidateA],
        enabled: !!address,
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
    })

    // const vote = ({ electionId, candidateAddress }: { electionId: number, candidateAddress: string }) => {
    //     const { data: votation } = useContractRead({
    //         address: `0x${metisVoteContract.address.slice(2, metisVoteContract.address.length)}`,
    //         abi: metisVoteContract.abi,
    //         functionName: "vote",
    //         args: [electionId, candidateAddress],
    //         onError: (error) => {
    //             const moreThan80Chars = error.message.length > 80;
    //             toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
    //         },
    //     })

    //     if (!votation) {
    //         return null
    //     }

    //     return votation;
    // }

    return {
        electionIdCounter,
        isAddressContractOwner: isAddressContractOwner === address,
        getElectionById,
        getCandidatesById,
        vote
    }
}