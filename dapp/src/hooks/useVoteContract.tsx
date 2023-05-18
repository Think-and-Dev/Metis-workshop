import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { toast } from 'sonner'
import metisVoteContract from "../../../contracts/deployments/metis/MetisVote.json"

export const useSbtContract = () => {
    const { address } = useAccount()

    return {
    
    }
}