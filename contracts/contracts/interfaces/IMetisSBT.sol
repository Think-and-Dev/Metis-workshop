// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMetisSBT {
    function claimSBT(uint256 _tokenId) external;

    function addVote(uint256 _electionId, uint256 _tokenId) external;

    event MetisSBTInitialized();
    event MintSBT(address indexed to, uint256 tokenId, string uri);
    event ContractURIUpdated(string contractUri);
    event DefaultTokenURIUpdated(string _defaultTokenURI);
    event MetisVoteSet(address indexed _metisVote);
    event VoteAdded(uint256 _tokenId, uint256 _electionId);
    event ClaimedSBT(address indexed user, uint256 tokenId);

    error TransferForbidden(string message);
    error VoteAlreadyEmitted(uint256 _electionId);
}
