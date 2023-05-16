// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMetisVote.sol";
import "./interfaces/IMetisSBT.sol";

contract MetisVote is IMetisVote, Ownable {
    address public immutable METIS_SBT;

    mapping(uint256 => Candidate) candidates;
    mapping(uint256 => Election) elections;

    constructor(address _metisSBT) {}

    function createNormalElection() {}

    function addCandidate() {}

    function vote() {}

    modifier validAddress(address _adr) {
        require(_adr != address(0), "MetisVote: Invalid address");
        _;
    }
}
