// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMetisVote {
    struct Candidate {
        bytes32 party;
        address person;
        bytes32 status;
    }

    struct Election {
        bytes32 position;
        uint256 startTime;
        uint256 endTime;
    }
}
