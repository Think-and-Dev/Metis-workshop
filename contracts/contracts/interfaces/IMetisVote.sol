// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMetisVote {
    struct Candidate {
        bytes32 party;
        bytes32 status;
        uint256 votes;
    }

    struct Election {
        bytes32 position; //GOVERNADOR || PRESIDENTE || DIPUTADO
        uint256 startTime;
        uint256 endTime;
    }

    function isActiveElection(uint256 _electionId) external view returns (bool);

    function getCandidateVotes(uint256 _electionId, address _candidate) external view returns (uint256);

    function getCandidatesByElection(uint256 _electionId) external view returns (address[] memory);

    function getCandidatesLengthByElection(uint256 _electionId) external view returns (uint256);

    function registerVoter(uint256 _tokenId) external;

    function vote(uint256 _electionId, address _candidate) external;

    event MetisVoteInitialized(address indexed _metisSBT);
    event ElectionCreated(bytes32 _position, uint256 _startTime, uint256 _endTime);
    event ElectionStartTimeUpdated(uint256 _electionId, uint256 _oldStartTime, uint256 _newStartTime);
    event ElectionEndTimeUpdated(uint256 _electionId, uint256 _oldEndTime, uint256 _newEndTime);
    event CandidateAdded(uint256 _electionId, bytes32 _party, address indexed _person);
    event Vote(uint256 indexed _electionId, address indexed _candidate);
    event VoterRegistered(address indexed voter, uint256 _tokenId);
    event ElectionClosed(uint256 _electionId, address indexed _candidate, uint256 votes);

    error NotACandidate(address _candidate);
    error VoterNotRegistered();
}
