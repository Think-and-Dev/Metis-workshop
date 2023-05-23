import { useEffect } from "react"
import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { toast } from 'sonner'
import metisSbtContract from "../../../contracts/deployments/metis/MetisSBT.json"

export const useSbtContract = () => {
    const { address } = useAccount()

    useEffect(() => {
        refetchTokenIdCounter();
        refetchisAddressContractOwner();
    }, [address]);

    const { data: isAddressContractOwner, refetch: refetchisAddressContractOwner } = useContractRead({
        address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
        abi: metisSbtContract.abi,
        functionName: "owner"
    })

    const { data: userHasSbt, refetch: refetchBalanceOf } = useContractRead({
        address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
        abi: metisSbtContract.abi,
        functionName: "balanceOf",
        args: [address],
        enabled: !!address,
    })

    const { data: userSbtTokenId, refetch : refetchUserSbtTokenId } = useContractRead({
        address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
        abi: metisSbtContract.abi,
        enabled: !!address,
        args: [address],
        functionName: "userSBTs",
    })

    const { data: lastMintedSBT, refetch: refetchLastMintedSBT } = useContractRead({
        address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
        abi: metisSbtContract.abi,
        functionName: "lastMintedSBT",
    })

    const { data: tokenIdCounter, refetch: refetchTokenIdCounter } = useContractRead({
        address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
        abi: metisSbtContract.abi,
        functionName: "_tokenIdCounter",
    })

    const getTokenUri = ({ tokenId }: { tokenId: number }) => {
        const { data: tokenUri } = useContractRead({
            address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
            args: [tokenId],
            enabled: !!tokenId,
            abi: metisSbtContract.abi,
            functionName: "tokenURI",
        })
        return tokenUri;
    }

    const claimSbt = useContractWrite({
        address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
        abi: metisSbtContract.abi,
        functionName: 'claimSBT',
        args: [Number(lastMintedSBT) + 1],
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
        onSuccess: () => {
            refetchBalanceOf();
            refetchTokenIdCounter();
            refetchLastMintedSBT();
            refetchUserSbtTokenId();
            toast.success(`SBT token minted to address : ${address}`);
        }
    })

    const userAlreadyVote = ({ electionId, userSbtTokenId }: { electionId: number, userSbtTokenId: number }) => {
        const { data, refetch : refetchUserAlreadyVote } = useContractRead({
            address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
            args: [electionId, userSbtTokenId],
            enabled: !!electionId && !!userSbtTokenId,
            abi: metisSbtContract.abi,
            functionName: "votes",
            onError: (error) => {
                const moreThan80Chars = error.message.length > 80;
                toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
            },
        })

        return data;
    }

    return {
        tokenIdCounter,
        userSbtTokenId: Number(userSbtTokenId),
        userAlreadyVote,
        getTokenUri,
        isAddressContractOwner: isAddressContractOwner === address,
        userHasSbt: Number(userHasSbt) > 0,
        claimSbt
    }
}