import {task} from 'hardhat/config'
import chalk from 'chalk'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {MetisSBT} from '../typechain-types'

export const tasks = () => {
  task('lazymint', 'Lazy mint MetisSBTs').setAction(async ({}, {ethers}) => {
    const [admin]: SignerWithAddress[] = await ethers.getSigners()
    const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
    const response = await MetisSBT.connect(admin).safeLazyMint()

    console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
    const receipt = await response.wait()
    if (receipt.status !== 0) {
      console.log(chalk.green('Done!'))
    } else {
      console.log(chalk.red('Failed!'))
    }
  })

  task('lazy-mint-batch', 'Lazy mint batch MetisSBTs')
    .addParam('quantity', 'Amount of sbts to lazy mint')
    .setAction(async ({quantity}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
      const response = await MetisSBT.connect(admin).safeLazyMintBatch(quantity)

      console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        console.log(chalk.green('Done!'))
      } else {
        console.log(chalk.red('Failed!'))
      }
    })
}
