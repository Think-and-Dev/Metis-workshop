import metisVoteContract from "../../../contracts/deployments/metis/MetisVote.json";
import metisSbtContract from "../../../contracts/deployments/metis/MetisSBT.json";

export const METIS_VOTE_ADDRESS: string = `${metisVoteContract.address.slice(
  2,
  metisVoteContract.address.length
)}`;
export const METIS_SBT_ADDRESS: string = `${metisSbtContract.address.slice(
  2,
  metisSbtContract.address.length
)}`;
