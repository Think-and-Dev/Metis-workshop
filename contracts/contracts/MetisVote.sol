// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./interfaces/IMetisVote.sol";
import "./interfaces/IMetisSBT.sol";

contract MetisVote is IMetisVote, Ownable {
    using Counters for Counters.Counter;

    address public immutable METIS_SBT;
    Counters.Counter public _electionIdCounter;

    bytes32 public constant CANDIDATE_STATUS = keccak256("CANDIDATE_STATUS");
    bytes32 public constant ELECTED_STATUS = keccak256("ELECTED_STATUS");

    /// @dev ElectionId => Election
    mapping(uint256 => Election) public elections;

    ///@dev ElectionId => user => Candidate
    mapping(uint256 => mapping(address => Candidate)) public candidates;
    CandidateInfo[] public candidateInfo;

    ///@dev Voter => MetisSBT
    mapping(address => uint256) public voters;

    constructor(address _metisSBT) validAddress(_metisSBT) {
        METIS_SBT = _metisSBT;
        //Election ID must start with one and not zero.
        _electionIdCounter.increment();
        emit MetisVoteInitialized(_metisSBT);
    }

    /**************************** GETTERS  ****************************/

    function isActiveElection(uint256 _electionId) external view returns (bool) {
        return _isActiveElection(_electionId);
    }

    function getCandidateVotes(
        uint256 _electionId,
        address _candidate
    ) external view validAddress(_candidate) returns (uint256) {
        if (candidates[_electionId][_candidate].status == bytes32(0)) {
            revert NotACandidate(_candidate);
        }
        return candidates[_electionId][_candidate].votes;
    }

    function getCandidates() external view returns (CandidateInfo[] memory) {
        return candidateInfo;
    }

    function getCandidatesLength() external view returns (uint256) {
        return candidateInfo.length;
    }

    /**************************** INTERFACE  ****************************/

    function createElection(bytes32 _position, uint256 _startTime, uint256 _endTime) external onlyOwner {
        _checkElection(_position, _startTime, _endTime);
        Election memory e = Election({position: _position, startTime: _startTime, endTime: _endTime});
        elections[_electionIdCounter.current()] = e;

        _electionIdCounter.increment();

        emit ElectionCreated(_position, _startTime, _endTime);
    }

    function addCandidate(uint256 _electionId, bytes32 _party, address _person) external onlyOwner {
        _addCandidate(_electionId, _party, _person);
    }

    function addCandidates(
        uint256 _electionId,
        bytes32[] memory _parties,
        address[] memory _candidates
    ) external onlyOwner {
        require(_parties.length == _candidates.length, "MetisVote: Lengths mismatch");
        for (uint256 i = 0; i < _candidates.length; i++) {
            _addCandidate(_electionId, _parties[i], _candidates[i]);
        }
    }

    function registerVoter(uint256 _tokenId) external {
        require(IERC721(METIS_SBT).ownerOf(_tokenId) == msg.sender, "MetisVote: Not owner of SBT");
        voters[msg.sender] = _tokenId;
        emit VoterRegistered(msg.sender, _tokenId);
    }

    function vote(uint256 _electionId, address _candidate) external validAddress(_candidate) {
        require(_isActiveElection(_electionId), "MetisVote: Invalid Election");
        require(_isValidCandidate(_electionId, _candidate), "MetisVote: Invalid Candidate");
        require(IERC721(METIS_SBT).balanceOf(msg.sender) == 1, "MetisVote: No vote allowed");

        uint256 voterSBT = voters[msg.sender];
        if (voterSBT == 0) {
            revert VoterNotRegistered();
        }

        candidates[_electionId][_candidate].votes += 1;
        IMetisSBT(METIS_SBT).addVote(_electionId, voterSBT);

        emit Vote(_electionId, _candidate);
    }

    function closeElection(uint256 _electionId, address _candidate) external validAddress(_candidate) onlyOwner {
        require(block.timestamp >= elections[_electionId].endTime, "MetisVote: Election not finished");
        candidates[_electionId][_candidate].status = ELECTED_STATUS;
        emit ElectionClosed(_electionId, _candidate, candidates[_electionId][_candidate].votes);
    }

    /**************************** INTERNALS  ****************************/

    function _addCandidate(uint256 _electionId, bytes32 _party, address _person) internal onlyOwner {
        require(
            elections[_electionId].startTime >= block.timestamp && block.timestamp < elections[_electionId].endTime,
            "MetisVote: Election no longer valid"
        );
        require(_party.length > 0, "MetisVote: Invalid party");
        require(_person != address(0), "MetisVote: Invalid candidate address");

        Candidate memory newCandidate = Candidate({party: _party, status: CANDIDATE_STATUS, votes: 0});
        CandidateInfo memory candInfo = CandidateInfo({candidate: _person, candidateId: _electionId});

        candidates[_electionId][_person] = newCandidate;
        candidateInfo.push(candInfo);

        emit CandidateAdded(_electionId, _party, _person);
    }

    function _checkElection(bytes32 _position, uint256 _startTime, uint256 _endTime) internal view onlyOwner {
        require(_position.length > 0, "MetisVote: Invalid position");
        require(_startTime >= block.timestamp, "MetisVote: Invalid start time");
        require(_endTime > _startTime, "MetisVote: Invalid end time");
    }

    function _isActiveElection(uint256 _electionId) internal view returns (bool) {
        if (block.timestamp >= elections[_electionId].startTime && block.timestamp < elections[_electionId].endTime) {
            return true;
        }
        return false;
    }

    function _isValidCandidate(uint256 _electionId, address _candidate) internal view returns (bool) {
        if (candidates[_electionId][_candidate].status == bytes32(0)) {
            return false;
        }
        return true;
    }

    /**************************** MODIFIERS  ****************************/

    modifier validAddress(address _adr) {
        require(_adr != address(0), "MetisVote: Invalid address");
        _;
    }
}
