import {ethers, deployments, getNamedAccounts} from 'hardhat'
import {MetisSBT, MetisVote} from '../typechain-types'

export const metisFixture = deployments.createFixture(async () => {
  await deployments.fixture(['v1.0.0'])

  const {deployer} = await getNamedAccounts()

  const MetisSBTContract: MetisSBT = await ethers.getContract<MetisSBT>('MetisSBT', deployer)
  const MetisVoteContract: MetisVote = await ethers.getContract<MetisVote>('MetisVote', deployer)

  return {
    MetisSBTContract,
    MetisVoteContract
  }
})
