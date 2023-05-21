// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMetisVote {
    struct Candidate {
        bytes32 party;
        bytes32 status;
        uint256 votes;
    }

    struct CandidateInfo {
        address candidate;
        uint256 candidateId;
    }

    struct Election {
        bytes32 position; //GOVERNADOR || PRESIDENTE || DIPUTADO
        uint256 startTime;
        uint256 endTime;
    }

    struct Ballotage {
        Candidate c1;
        Candidate c2;
    }

    event MetisVoteInitialized(address indexed _metisSBT);
    event ElectionCreated(bytes32 _position, uint256 _startTime, uint256 _endTime);
    event CandidateAdded(uint256 _electionId, bytes32 _party, address indexed _person);
    event Vote(uint256 indexed _electionId, address indexed _candidate);
    event VoterRegistered(address indexed voter, uint256 _tokenId);
    event ElectionClosed(uint256 _electionId, address indexed _candidate, uint256 votes);

    error NotACandidate(address _candidate);
    error VoterNotRegistered();
}
