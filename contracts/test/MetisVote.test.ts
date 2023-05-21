import {expect} from 'chai'
import {ethers, getNamedAccounts} from 'hardhat'
import {metisFixture} from './fixture'
import {Signer} from 'ethers'
import {MetisSBT, MetisVote} from '../typechain-types'
import {keccak256, toUtf8Bytes} from 'ethers/lib/utils'
import {getBlockTimestamp} from '../utils'
import {ELECTION_POSITION} from './constants'

describe('Metis SBT initial', () => {
  let deployer: Signer
  let invalidSigner: Signer
  let MetisVote: MetisVote
  let MetisSBT: MetisSBT

  before(async () => {
    const accounts = await getNamedAccounts()
    const signers = await ethers.getSigners()
    deployer = await ethers.getSigner(accounts.deployer)
    invalidSigner = signers[18]
  })

  beforeEach(async () => {
    const {MetisVoteContract, MetisSBTContract} = await metisFixture()
    MetisVote = MetisVoteContract
    MetisSBT = MetisSBTContract
  })

  it('Correct initialization', async () => {
    //GIVEN
    const expectedOwner = await deployer.getAddress()
    const expectedMetisSBT = MetisSBT.address
    const expectedElectionIdCounter = 1
    //WHEN
    const owner = await MetisVote.owner()
    const metisSBT = await MetisVote.METIS_SBT()
    const electionIdCounter = await MetisVote._electionIdCounter()
    //THEN
    expect(owner).to.be.equal(expectedOwner)
    expect(metisSBT).to.be.equal(expectedMetisSBT)
    expect(electionIdCounter).to.be.equal(expectedElectionIdCounter)
  })

  it('Is active election should return false', async () => {
    const isActive = await MetisVote.isActiveElection(20)
    expect(isActive).to.be.false
  })

  it('Get Candidates should return zero array', async () => {
    await expect(await MetisVote.getCandidatesLength()).to.be.equal('0')
  })

  it('Should not allow to create election to anyone', async () => {
    await expect(
      MetisVote.connect(invalidSigner).createElection(keccak256(toUtf8Bytes('bla')), '10', '20')
    ).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('Should not allow to create election with invalid start time', async () => {
    const currentTimestamp = await getBlockTimestamp()
    await expect(
      MetisVote.createElection(
        keccak256(toUtf8Bytes('president')),
        currentTimestamp.sub('30000'),
        currentTimestamp.add('30000')
      )
    ).to.be.revertedWith('MetisVote: Invalid start time')
  })

  it('Should not allow to create election with invalid end time', async () => {
    const currentTimestamp = await getBlockTimestamp()
    await expect(
      MetisVote.createElection(
        keccak256(toUtf8Bytes('president')),
        currentTimestamp.add('30000'),
        currentTimestamp.sub('30000')
      )
    ).to.be.revertedWith('MetisVote: Invalid end time')
  })

  it('Should not allow to add candidate to anybody', async () => {
    await expect(
      MetisVote.connect(invalidSigner).addCandidate(
        '0',
        keccak256(toUtf8Bytes('party one')),
        await invalidSigner.getAddress()
      )
    ).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('Should not allow to register voter to someone without metis sbt', async () => {
    const hasSBT = await MetisSBT.balanceOf(await invalidSigner.getAddress())
    expect(hasSBT).to.be.equal('0')
    await expect(MetisVote.connect(invalidSigner).registerVoter('3')).to.be.revertedWith('ERC721: invalid token ID')
  })

  it('Should not allow to vote if no election', async () => {
    await expect(MetisVote.connect(invalidSigner).vote('3', await invalidSigner.getAddress())).to.be.revertedWith(
      'MetisVote: Invalid Election'
    )
  })
})

describe('Metis Vote interface', () => {
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

    //Mint three sbts
    await MetisSBT.safeLazyMintBatch('3')
    await MetisSBT.connect(userOne).claimSBT('1')
    await MetisSBT.connect(userTwo).claimSBT('2')
    await MetisSBT.connect(userThree).claimSBT('3')

    const userOneBalance = await MetisSBT.balanceOf(await userOne.getAddress())
    const userTowBalance = await MetisSBT.balanceOf(await userTwo.getAddress())
    const userThreeBalance = await MetisSBT.balanceOf(await userThree.getAddress())

    expect(userOneBalance).to.be.equal('1')
    expect(userTowBalance).to.be.equal('1')
    expect(userThreeBalance).to.be.equal('1')
  })

  it('Create Election', async () => {
    //GIVEN
    const electionPosition = ELECTION_POSITION
    //WHEN

    //THEN
  })

  xit('Add candidate', async () => {})

  xit('Add candidates', async () => {})

  xit('Register Voter', async () => {})

  xit('Vote', async () => {})

  xit('Close Election', async () => {})
})
