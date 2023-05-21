import {ethers} from 'hardhat'
import {BigNumber} from 'ethers'

export const getBlockTimestamp = async () => {
  const block = await ethers.provider.getBlock('latest')
  return BigNumber.from(block.timestamp)
}

export const advanceTime = async (time) => {
  await ethers.provider.send('evm_increaseTime', [time])
}
