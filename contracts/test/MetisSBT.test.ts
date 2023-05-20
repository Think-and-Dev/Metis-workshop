import {expect} from 'chai'
import {ethers, getNamedAccounts} from 'hardhat'
import {metisFixture} from './fixture'
import {Signer} from 'ethers'
import {MetisSBT, MetisVote} from '../typechain-types'
import {keccak256, toUtf8Bytes} from 'ethers/lib/utils'

describe('Metis SBT initial', () => {
  let deployer: Signer
  let invalidSigner: Signer
  let MetisSBT: MetisSBT

  before(async () => {
    const accounts = await getNamedAccounts()
    const signers = await ethers.getSigners()
    deployer = await ethers.getSigner(accounts.deployer)
    invalidSigner = signers[18]
  })

  beforeEach(async () => {
    const {MetisSBTContract} = await metisFixture()
    MetisSBT = MetisSBTContract
  })

  it('Correct initialization', async () => {
    //GIVEN
    const expectedName = 'MetisSBT'
    const expectedSymbol = 'MSBT'
    const expectedOwner = await deployer.getAddress()
    //WHEN
    const name = await MetisSBT.name()
    const symbol = await MetisSBT.symbol()
    const owner = await MetisSBT.owner()
    //THEN
    expect(name).to.be.equal(expectedName)
    expect(symbol).to.be.equal(expectedSymbol)
    expect(owner).to.be.equal(expectedOwner)
  })

  it('Set Contract URI', async () => {
    //GIVEN
    const newContractUri = 'localhost:3000'
    //WHEN
    await MetisSBT.setContractURI(newContractUri)
    const contractUri = await MetisSBT.contractUri()
    //THEN
    expect(newContractUri).to.be.equal(contractUri)
  })

  it('Should not allow to set contract uri to anybody', async () => {
    await expect(MetisSBT.connect(invalidSigner).setContractURI('asdas')).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('Set metis vote contract', async () => {
    //GIVEN
    const voteAddress = await deployer.getAddress()
    //WHEN
    await MetisSBT.setMetisVote(voteAddress)
    const expectedVoteAddress = await MetisSBT.METIS_VOTE()
    //THEN
    expect(voteAddress).to.be.equal(expectedVoteAddress)
  })

  it('Should not allow to set an invalid metis vote contract', async () => {
    await expect(MetisSBT.setMetisVote(ethers.constants.AddressZero)).to.be.revertedWith('MetisSBT: INVALID ADDRESS')
  })

  it('Should not allow to set metis vote to anybody', async () => {
    await expect(MetisSBT.connect(invalidSigner).setMetisVote(ethers.constants.AddressZero)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('Transfer from should be not allowed', async () => {
    await expect(
      MetisSBT.transferFrom(await deployer.getAddress(), await deployer.getAddress(), '10000')
    ).to.be.revertedWithCustomError(MetisSBT, 'TransferForbidden')
  })

  it('Transfer from should not be allowed', async () => {
    await expect(
      MetisSBT['safeTransferFrom(address,address,uint256)'](
        await deployer.getAddress(),
        await deployer.getAddress(),
        '10000'
      )
    ).to.be.revertedWithCustomError(MetisSBT, 'TransferForbidden')
  })

  it('Transfer from with bytes data should not be allowed', async () => {
    await expect(
      MetisSBT['safeTransferFrom(address,address,uint256,bytes)'](
        await deployer.getAddress(),
        await deployer.getAddress(),
        '10000',
        keccak256(toUtf8Bytes('asdas'))
      )
    ).to.be.revertedWithCustomError(MetisSBT, 'TransferForbidden')
  })
})

describe('Metis SBT interface', () => {
  let deployer: Signer
  let invalidSigner: Signer
  let userOne: Signer, userTwo: Signer, userThree: Signer
  let MetisSBT: MetisSBT
  let MetisVote: MetisVote

  before(async () => {
    const accounts = await getNamedAccounts()
    const signers = await ethers.getSigners()
    deployer = await ethers.getSigner(accounts.deployer)
    invalidSigner = signers[18]
    userOne = await ethers.getSigner(accounts.user)
    userTwo = signers[17]
    userThree = signers[16]

    const {MetisSBTContract, MetisVoteContract} = await metisFixture()
    MetisSBT = MetisSBTContract
    MetisVote = MetisVoteContract

    const contractURI = 'localhost:3000'
    const defaultTokenURI = 'localhost:3000/default'

    await MetisSBT.setContractURI(contractURI)
    await MetisSBT.setDefaultTokenURI(defaultTokenURI)
    await MetisSBT.setMetisVote(MetisVote.address)
  })

  it('Should allow to mint', async () => {
    //GIVEN
    const newTokenURI = 'ipfs://1'
    const user = await userOne.getAddress()
    //WHEN
    await MetisSBT.mint(user, newTokenURI)
    const userOneBalance = await MetisSBT.balanceOf(user)
    const ownerOfSBT = await MetisSBT.ownerOf('1')
    const sbtLocked = await MetisSBT.locked('1')
    const sbtUri = await MetisSBT.tokenURI('1')
    const availableToMint = await MetisSBT.availableToMint('1')
    //THEN
    expect(userOneBalance).to.be.equal('1')
    expect(ownerOfSBT).to.be.equal(user)
    expect(sbtLocked).to.be.true
    expect(sbtUri).to.be.equal(newTokenURI)
    expect(availableToMint).to.be.false
  })

  it('Should not allow to mint to anybody', async () => {
    await expect(MetisSBT.connect(invalidSigner).mint(await userOne.getAddress(), 'adsas')).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('Should not allow to mint to the zero address', async () => {
    await expect(MetisSBT.mint(ethers.constants.AddressZero, 'asads')).to.be.revertedWith('MetisSBT: Invalid address')
  })

  it('Should not allow to mint with invalid token uri', async () => {
    await expect(MetisSBT.mint(await userTwo.getAddress(), '')).to.be.revertedWith('MetisSBT: Empty URI')
  })

  it('Mint should emit event', async () => {
    await expect(MetisSBT.mint(await userTwo.getAddress(), 'ipfs://1'))
      .to.emit(MetisSBT, 'MintSBT')
      .withArgs(await userTwo.getAddress(), '2', 'ipfs://1')
  })

  it('Should allow to safe lazy mint', async () => {
    //GIVEN
    //WHEN
    await MetisSBT.safeLazyMint()
    const sbtOneLocked = await MetisSBT.locked('1')
    const availableToMintOne = await MetisSBT.availableToMint('1')
    const sbtTwoLocked = await MetisSBT.locked('2')
    const availableToMintTwo = await MetisSBT.availableToMint('2')

    const availableToMintThree = await MetisSBT.availableToMint('3')
    const sbtThreeLocked = await MetisSBT.locked('3')

    //THEN
    expect(sbtOneLocked).to.be.true
    expect(sbtTwoLocked).to.be.true
    expect(availableToMintOne).to.be.false
    expect(availableToMintTwo).to.be.false

    expect(sbtThreeLocked).to.be.false
    expect(availableToMintThree).to.be.true
  })

  it('Should not allow to lazy mint to anybody', async () => {
    await expect(MetisSBT.connect(invalidSigner).safeLazyMint()).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('Should allow to safe lazy mint batch', async () => {
    //GIVEN WHEN
    await MetisSBT.safeLazyMintBatch('5')
    const firstAvailableToMint = await MetisSBT.availableToMint('4')
    const lastAvailableToMint = await MetisSBT.availableToMint('8')
    //THEN
    expect(firstAvailableToMint).to.be.true
    expect(lastAvailableToMint).to.be.true
  })

  it('Should not allow to safe lazy mint barch to anybody', async () => {
    await expect(MetisSBT.connect(invalidSigner).safeLazyMintBatch('4')).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('Should allow to claim SBT', async () => {
    //GIVEN
    const user = await userThree.getAddress()
    const tokenIdToClaim = '4'
    const tokenURI = 'localhost:3000/default'
    const isAvailableToClaim = await MetisSBT.availableToMint('4')
    const isLocked = await MetisSBT.locked('4')
    //WHEN
    await MetisSBT.connect(userThree).claimSBT(tokenIdToClaim)
    const onwerOfSBT = await MetisSBT.ownerOf(tokenIdToClaim)
    const sbtURI = await MetisSBT.tokenURI(tokenIdToClaim)
    const sbtLocked = await MetisSBT.locked(tokenIdToClaim)
    const availableToMint = await MetisSBT.availableToMint(tokenIdToClaim)
    //THEN
    expect(isAvailableToClaim).to.be.true
    expect(isLocked).to.be.false

    expect(onwerOfSBT).to.be.equal(user)
    expect(sbtURI).to.be.equal(tokenURI)
    expect(availableToMint).to.be.false
    expect(sbtLocked).to.be.true
  })

  it('Should not allow to claim sbt if user already has one', async () => {
    await expect(MetisSBT.connect(userOne).claimSBT('5')).to.be.revertedWith('MetisSBT: User already has SBT')
  })
})
