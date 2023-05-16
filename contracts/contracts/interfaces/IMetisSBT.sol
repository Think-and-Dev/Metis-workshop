// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMetisSBT {
    event MintSBT(address indexed to, uint256 tokenId, string uri);
    event ContractURIUpdated(string contractUri);

    error TransferForbidden(string message);
}
