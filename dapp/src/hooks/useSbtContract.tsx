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

    const { data: tokenIdCounter, refetch: refetchTokenIdCounter } = useContractRead({
        address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
        abi: metisSbtContract.abi,
        functionName: "_tokenIdCounter",
    })

    const claimSbt = useContractWrite({
        address: `0x${metisSbtContract.address.slice(2, metisSbtContract.address.length)}`,
        abi: metisSbtContract.abi,
        functionName: 'claimSBT',
        args: [Number(tokenIdCounter)],
        onError: (error) => {
            const moreThan80Chars = error.message.length > 80;
            toast.error(`${error.message.slice(0, 80)}${(moreThan80Chars ? '...' : '')}`);
        },
        onSuccess: () => {
            toast.success(`SBT token minted to address : ${address}`);
            refetchBalanceOf();
            refetchTokenIdCounter();
        }
    })

    return {
        tokenIdCounter,
        isAddressContractOwner: isAddressContractOwner === address,
        userHasSbt: Number(userHasSbt) > 0,
        claimSbt
    }
}