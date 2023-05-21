import {expect, use} from 'chai'
import {ethers, getNamedAccounts} from 'hardhat'
import {metisFixture} from './fixture'
import {Signer} from 'ethers'
import {MetisSBT, MetisVote} from '../typechain-types'
import {keccak256, toUtf8Bytes} from 'ethers/lib/utils'
import {advanceTime, getBlockTimestamp} from '../utils'
import {CANDIDATE_STATUS, ELECTION_POSITION, PARTY_ONE, PARTY_TWO} from './constants'

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
    const position = ELECTION_POSITION
    const startTime = (await getBlockTimestamp()).add('30')
    const endTime = (await getBlockTimestamp()).add('9000')
    //WHEN
    await MetisVote.createElection(position, startTime, endTime)
    const Election = await MetisVote.elections('1')
    const electionPosition = Election[0]
    const electionStartTime = Election[1]
    const electionEndTime = Election[2]
    //THEN

    expect(position).to.be.equal(electionPosition)
    expect(startTime).to.be.equal(electionStartTime)
    expect(endTime).to.be.equal(electionEndTime)
  })

  it('Create Election should emit event', async () => {
    //GIVEN
    const position = ELECTION_POSITION
    const startTime = (await getBlockTimestamp()).add('12000')
    const endTime = (await getBlockTimestamp()).add('24000')

    //WHEN //THEN
    await expect(MetisVote.createElection(position, startTime, endTime))
      .to.emit(MetisVote, 'ElectionCreated')
      .withArgs(position, startTime, endTime)
  })

  it('Add candidate', async () => {
    //GIVEN
    const electionId = '1'
    const party = PARTY_ONE
    const cand = (await ethers.getSigners())[15]
    //WHEN
    await MetisVote.addCandidate(electionId, party, await cand.getAddress())
    const candidateInfo = await MetisVote.candidateInfo(0)
    const candidate = await MetisVote.candidates('1', await cand.getAddress())

    const candidateParty = candidate[0]
    const candidateStatus = candidate[1]
    const candidateVotes = candidate[2]

    const candInfoAddress = candidateInfo[0]
    const candInfoElectionId = candidateInfo[1]

    //THEN
    expect(await MetisVote.getCandidatesLength()).to.be.equal('1')

    expect(candidateParty).to.be.equal(party)
    expect(candidateStatus).to.be.equal(CANDIDATE_STATUS)
    expect(candidateVotes).to.be.equal('0')

    expect(candInfoAddress).to.be.equal(await cand.getAddress())
    expect(candInfoElectionId).to.be.equal(electionId)
  })

  it('Add candidate should emit event', async () => {
    //GIVEN //WHEN
    const candidateTwo = (await ethers.getSigners())[14].getAddress()
    //THEN
    expect(await MetisVote.addCandidate('1', PARTY_TWO, candidateTwo))
      .to.emit(MetisVote, 'CandidateAdded')
      .withArgs('1', PARTY_TWO, candidateTwo)
  })

  it('Register Voter', async () => {
    //GIVEN
    const voter = await userOne.getAddress()
    const tokenId = '1'
    //WHEN
    await MetisVote.connect(userOne).registerVoter(tokenId)
    const expectedVoter = await MetisVote.voters(voter)
    //THEN
    expect(expectedVoter).to.be.equal(tokenId)
  })

  it('Should not register voter if user is not owner of the sbt', async () => {
    await expect(MetisVote.connect(userTwo).registerVoter('3')).to.be.revertedWith('MetisVote: Not owner of SBT')
  })

  it('Register voter should emit event', async () => {
    //GIVEN //WHEN
    const voterTwo = await userTwo.getAddress()
    const tokenId = '2'
    expect(await MetisVote.connect(userTwo).registerVoter(tokenId))
      .to.emit(MetisVote, 'VoterRegistered')
      .withArgs(voterTwo, tokenId)
  })

  it('Could not vote if not active election', async () => {
    //GIVEN //WHEN
    const isActiveElectionOne = await MetisVote.isActiveElection('1')
    const candidateOne = (await MetisVote.getCandidates())[0]
    expect(isActiveElectionOne).to.be.false
    //THEN
    await expect(MetisVote.connect(userOne).vote('1', candidateOne[0])).to.be.revertedWith(
      'MetisVote: Invalid Election'
    )
  })

  it('Could not vote if invalid candidate', async () => {
    //GIVEN
    const isActiveElectionOne = await MetisVote.isActiveElection('1')
    expect(isActiveElectionOne).to.be.false
    const currentTimestamp = await getBlockTimestamp()
    const newEndTime = currentTimestamp.add('300000000000000000')

    //WHEN
    await advanceTime(3000)
    await MetisVote.changeEndTimeElection('1', newEndTime)
    const isActiveElectionOneNow = await MetisVote.isActiveElection('1')
    expect(isActiveElectionOneNow).to.be.true

    //THEN
    await expect(MetisVote.connect(userOne).vote('1', await userThree.getAddress())).to.be.revertedWith(
      'MetisVote: Invalid Candidate'
    )
  })

  xit('Could not vote if user has not sbt', async () => {
    const candidateOne = (await MetisVote.getCandidates())[0]
    await expect(MetisVote.connect(invalidSigner).vote('1', candidateOne[0])).to.be.revertedWith(
      'MetisVote: No vote allowed'
    )
  })

  it('Vote', async () => {
    //GIVEN
    const candidates = await MetisVote.getCandidates()
    const candidateOne = candidates[0][0]
    const candidateTwo = candidates[1][0]
    const candidateOneVotes = await MetisVote.getCandidateVotes('1', candidateOne)
    const candidateTwoVotes = await MetisVote.getCandidateVotes('1', candidateTwo)
    //WHEN
    await MetisVote.connect(userOne).vote('1', candidateOne)
    await MetisVote.connect(userTwo).vote('1', candidateTwo)
    const newCandidateOneVotes = await MetisVote.getCandidateVotes('1', candidateOne)
    const newCandidateTwoVotes = await MetisVote.getCandidateVotes('1', candidateTwo)
    //THEN
    expect(candidateOneVotes).to.be.equal('0')
    expect(candidateTwoVotes).to.be.equal('0')
    expect(newCandidateOneVotes).to.be.equal('1')
    expect(newCandidateTwoVotes).to.be.equal('1')
  })

  xit('Vote should emit event', async () => {})

  xit('Close Election', async () => {})
})
