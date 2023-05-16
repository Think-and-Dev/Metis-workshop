// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IMetisVote.sol";
import "./interfaces/IMetisSBT.sol";

contract MetisVote is IMetisVote, Ownable {
    using Counters for Counters.Counter;

    address public immutable METIS_SBT;
    /// @dev Private counter to make internal security checks
    Counters.Counter private _electionIdCounter;

    bytes32 public constant CANDIDATE_STATUS = keccak256("CANDIDATE_STATUS");
    bytes32 public constant ELECTED_STATUS = keccak256("ELECTED_STATUS");

    mapping(address => Candidate) candidates;
    mapping(uint256 => Election) elections;

    constructor(address _metisSBT) validAddress(_metisSBT) {
        METIS_SBT = _metisSBT;
        emit MetisVoteInitialized(_metisSBT);
    }

    /**************************** GETTERS  ****************************/

    function isActiveElection(uint256 _electionId) external view returns (bool) {}

    function getCandidateVotes(uint256 _electionId, address _candidate) external view returns (uint256) {}

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

    function vote(uint256 _electionId, address _candidate) external validAddress(_candidate) {}

    /**************************** INTERNALS  ****************************/

    function _addCandidate(uint256 _electionId, bytes32 _party, address _person) internal onlyOwner {
        require(
            elections[_electionId].startTime >= block.timestamp && block.timestamp < elections[_electionId].endTime,
            "MetisVote: Election no longer valid"
        );
        require(_party.length > 0, "MetisVote: Invalid party");
        require(_person != address(0), "MetisVote: Invalid candidate address");

        Candidate memory newCandidate = Candidate({electionId: _electionId, party: _party, status: CANDIDATE_STATUS});

        candidates[_person] = newCandidate;
        emit CandidateAdded(_electionId, _party, _person);
    }

    function _checkElection(bytes32 _position, uint256 _startTime, uint256 _endTime) internal view onlyOwner {
        require(_position.length > 0, "MetisVote: Invalid position");
        require(block.timestamp >= _startTime, "MetisVote: Invalid start time");
        require(_startTime > _endTime, "MetisVote: Invalid end time");
    }

    modifier validAddress(address _adr) {
        require(_adr != address(0), "MetisVote: Invalid address");
        _;
    }
}
