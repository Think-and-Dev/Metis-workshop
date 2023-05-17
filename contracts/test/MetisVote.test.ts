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

  xit('Correct initialization', async () => {
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
})
