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
  let MetisSBT: MetisSBT
  let MetisVote: MetisVote

  before(async () => {
    const accounts = await getNamedAccounts()
    const signers = await ethers.getSigners()
    deployer = await ethers.getSigner(accounts.deployer)
    invalidSigner = signers[18]

    const {MetisSBTContract, MetisVoteContract} = await metisFixture()
    MetisSBT = MetisSBTContract
    MetisVote = MetisVoteContract

    const contractURI = 'localhost:3000'
    const defaultTokenURI = 'localhost:3000/default'

    await MetisSBT.setContractURI(contractURI)
    await MetisSBT.setDefaultTokenURI(defaultTokenURI)
    await MetisSBT.setMetisVote(MetisVote.address)
  })

  it('All ok', async () => {
    console.log('All ok')
  })
})
