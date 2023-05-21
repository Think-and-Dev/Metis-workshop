import {task} from 'hardhat/config'
import chalk from 'chalk'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {MetisSBT} from '../typechain-types'

export const tasks = () => {
  task('mint', 'Mint MetisSBT')
    .addParam('to', 'Address receiving SBT')
    .addParam('uri', 'Token URI')
    .setAction(async ({to, uri}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
      const response = await MetisSBT.connect(admin).mint(to, uri)

      console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        console.log(chalk.green('Done!'))
      } else {
        console.log(chalk.red('Failed!'))
      }
    })
}
