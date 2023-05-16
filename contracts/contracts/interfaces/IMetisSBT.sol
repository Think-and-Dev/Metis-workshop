// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMetisSBT {
    function addVote(uint256 _electionId, uint256 _tokenId) external;

    event MintSBT(address indexed to, uint256 tokenId, string uri);
    event ContractURIUpdated(string contractUri);
    event MetisVoteSet(address indexed _metisVote);
    event VoteAdded(uint256 _tokenId, uint256 _electionId);

    error TransferForbidden(string message);
}
