// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./interfaces/IMetisSBT.sol";
import "./interfaces/IERC5192.sol";

contract MetisSBT is IMetisSBT, IERC5192, Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    /// @dev Public counter to make internal security checks
    Counters.Counter public _tokenIdCounter;

    /// @dev ContractUri
    string public contractUri;
    string public defaultTokenUri;
    address public METIS_VOTE;

    mapping(uint256 => bool) private lockedSBTs;
    mapping(uint256 => bool) public availableToMint;

    //ELECTIONID -> USER -> FALSE | TRUE
    mapping(uint256 => mapping(uint256 => bool)) public votes;

    constructor() ERC721("MetisSBT", "MSBT") {
        /// @dev Doing this because first SBT has to be one and not zero.
        _tokenIdCounter.increment();
        emit MetisSBTInitialized();
    }

    /**************************** GETTERS  ****************************/

    /// @custom:notice The following function is override required by Solidity.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function locked(uint256 tokenId) external view returns (bool) {
        return lockedSBTs[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**************************** INTERFACE  ****************************/

    /// @notice Modify contractUri for NFT collection
    /// @param _contractUri contractUri
    function setContractURI(string memory _contractUri) external onlyOwner {
        contractUri = _contractUri;
        emit ContractURIUpdated(contractUri);
    }

    function setDefaultTokenURI(string memory _defaultTokenURI) external onlyOwner {
        defaultTokenUri = _defaultTokenURI;
        emit DefaultTokenURIUpdated(_defaultTokenURI);
    }

    function setMetisVote(address _metisVote) external onlyOwner {
        require(_metisVote != address(0), "MetisSBT: INVALID ADDRESS");
        METIS_VOTE = _metisVote;
        emit MetisVoteSet(_metisVote);
    }

    function mint(address _to, string memory _uri) external onlyOwner returns (uint256) {
        uint256 tokenId = _mintSBT(_to, _uri);
        emit MintSBT(_to, tokenId, _uri);
        return tokenId;
    }

    /// @notice Lazy Mint NFTs
    /// @return id of the next NFT to be minted
    function safeLazyMint() external onlyOwner returns (uint256) {
        uint256 currentTokenId = _tokenIdCounter.current();
        availableToMint[currentTokenId] = true;
        _tokenIdCounter.increment();
        return currentTokenId;
    }

    /// @notice Laxy Batch Mint NFTs
    /// @param quantity amount of NFTs to be minted
    /// @return id of the next NFT to be minted
    function safeLazyMintBatch(uint256 quantity) external onlyOwner returns (uint256) {
        uint256 currentTokenId = _tokenIdCounter.current();
        for (uint256 i = 0; i < quantity; i++) {
            currentTokenId = _tokenIdCounter.current();
            availableToMint[currentTokenId] = true;
            _tokenIdCounter.increment();
        }
        return currentTokenId;
    }

    function claimSBT(uint256 _tokenId) external {
        require(balanceOf(msg.sender) == 0, "MetisSBT: User already has SBT");
        require(availableToMint[_tokenId], "MetisSBT: Token not available to mint");
        require(!lockedSBTs[_tokenId], "MetisSBT: Token locked");

        availableToMint[_tokenId] = false;
        lockedSBTs[_tokenId] = true;
        _safeMint(msg.sender, _tokenId);
        super._setTokenURI(_tokenId, defaultTokenUri);

        emit Locked(_tokenId);
        emit ClaimedSBT(msg.sender, _tokenId);
    }

    function addVote(uint256 _electionId, uint256 _tokenId) external onlyMetisVote {
        require(!availableToMint[_tokenId], "MetisSBT: Token is free to mint");
        require(lockedSBTs[_tokenId], "MetisSBT: token is free to mint");
        require(ownerOf(_tokenId) != address(0), "MetisSBT: token has no owner");

        votes[_electionId][_tokenId] = true;

        emit VoteAdded(_tokenId, _electionId);
    }

    /**************************** INTERNALS  ****************************/

    function _mintSBT(address _to, string memory _uri) internal onlyOwner returns (uint256) {
        _checkMint(_to, _uri);
        uint256 _tokenId = _tokenIdCounter.current();

        //mint sbt
        lockedSBTs[_tokenId] = true;
        availableToMint[_tokenId] = false;
        _safeMint(_to, _tokenId);
        super._setTokenURI(_tokenId, _uri);

        _tokenIdCounter.increment();

        emit Locked(_tokenId);
        return _tokenId;
    }

    function _checkMint(address _to, string memory _uri) internal view onlyOwner {
        require(_to != address(0), "MetisSBT: Invalid address");
        require(balanceOf(_to) == 0, "MetisSBT: User already has SBT");
        require(bytes(_uri).length > 0, "MetisSBT: Empty URI");
    }

    /// @custom:notice The following function is override required by Solidity.
    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);
    }

    /**
     * @dev See {ERC721-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function transferFrom(address, address, uint256) public pure override {
        revert TransferForbidden("NO TRANSFER FROM ALLOWED");
    }

    function safeTransferFrom(address, address, uint256) public pure override {
        revert TransferForbidden("NO TRANSFER FROM ALLOWED");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert TransferForbidden("NO TRANSFER FROM ALLOWED");
    }

    modifier onlyMetisVote() {
        require(msg.sender == METIS_VOTE, "MetisSBT: ONLY METIS VOTE CONTRACT");
        _;
    }
}
