import {expect} from 'chai'
import {ethers, getNamedAccounts} from 'hardhat'
import {metisFixture} from './fixture'
import {Signer} from 'ethers'
import {MetisSBT, MetisVote} from '../typechain-types'
import {keccak256, toUtf8Bytes} from 'ethers/lib/utils'

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
    //WHEN
    const owner = await MetisSBT.owner()
    //THEN
    expect(owner).to.be.equal(expectedOwner)
  })
})
