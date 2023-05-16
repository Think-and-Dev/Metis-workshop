// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./interfaces/IMetisSBT.sol";
import "./interfaces/IERC5192.sol";

contract MetisSBT is IMetisSBT, IERC5192, Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    /// @dev Private counter to make internal security checks
    Counters.Counter private _tokenIdCounter;

    /// @dev ContractUri
    string public contractUri;
    uint256 public immutable CAP;

    mapping(uint256 => bool) private lockedSBTs;
    mapping(uint256 => bool) private availableToMint;

    constructor(uint256 _cap) ERC721("MetisSBT", "MSBT") {
        require(_cap > 0, "INVALID CAP");
        CAP = _cap;
        // emit MetisSBTInitialized();
    }

    /// @notice Modify contractUri for NFT collection
    /// @param _contractUri contractUri
    function setContractURI(string memory _contractUri) external onlyOwner {
        contractUri = _contractUri;
        emit ContractURIUpdated(contractUri);
    }

    /// @custom:notice The following function is override required by Solidity.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function locked(uint256 tokenId) external view returns (bool) {
        return lockedSBTs[tokenId];
    }

    function mint(address _to, string memory _uri) external onlyOwner returns (uint256) {
        uint256 tokenId = _mintSBT(_to, _uri);
        emit MintSBT(_to, tokenId, _uri);
        return tokenId;
    }

    function mintBatchByRole(address[] memory _to, string memory _uri, bytes32 _role) external onlyOwner {
        for (uint256 i = 0; i < _to.length; i++) {
            _checkMint(_to[i], _uri);
            _mintSBT(_to[i], _uri);
        }
    }

    /// @notice Lazy Mint NFTs
    /// @return id of the next NFT to be minted
    function safeLazyMint() external onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        uint256 currentTokenId = _tokenIdCounter.current();
        require(currentTokenId <= CAP, "NFTCAPPED: cap exceeded");
        availableToMint[currentTokenId] = true;
        return currentTokenId;
    }

    /// @notice Laxy Batch Mint NFTs
    /// @param quantity amount of NFTs to be minted
    /// @return id of the next NFT to be minted
    function safeLazyMintBatch(uint256 quantity) external onlyOwner returns (uint256) {
        uint256 currentTokenId = _tokenIdCounter.current();
        require(currentTokenId + quantity <= CAP, "NFTCAPPED: cap exceeded");
        for (uint256 i = 0; i < quantity; i++) {
            _tokenIdCounter.increment();
            currentTokenId = _tokenIdCounter.current();
            availableToMint[currentTokenId] = true;
        }
        return currentTokenId;
    }

    function _mintSBT(address _to, string memory _uri) internal onlyOwner returns (uint256) {
        _checkMint(_to, _uri);
        uint256 _tokenId = _tokenIdCounter.current();

        //mint sbt
        lockedSBTs[_tokenId] = true;
        _safeMint(_to, _tokenId);
        super._setTokenURI(_tokenId, _uri);

        _tokenIdCounter.increment();

        emit Locked(_tokenId);
        return _tokenId;
    }

    function _checkMint(address _to, string memory _uri) internal onlyOwner {
        require(_to != address(0), "MetisSBT: Invalid address");
    }

    /// @custom:notice The following function is override required by Solidity.
    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
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
}
