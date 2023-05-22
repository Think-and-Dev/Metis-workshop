import chalk from 'chalk'
import {task} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {MetisSBT} from '../typechain-types'

export const tasks = () => {
  task('set-contract-uri', 'Set Contract URI')
    .addParam('uri', 'Contract URI')
    .setAction(async ({uri}, {deployments, ethers, network}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
      const response = await MetisSBT.connect(admin).setContractURI(uri)

      console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        console.log(chalk.green('Done!'))
      } else {
        console.log(chalk.red('Failed!'))
      }
    })

  task('set-default-token-uri', 'Set Defatul token URI')
    .addParam('uri', 'Token URI')
    .setAction(async ({uri}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
      const response = await MetisSBT.connect(admin).setDefaultTokenURI(uri)

      console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        console.log(chalk.green('Done!'))
      } else {
        console.log(chalk.red('Failed!'))
      }
    })

  task('set-metis-vote', 'Set Metis Vote Contract')
    .addParam('address', 'Metis Vote Contract address')
    .setAction(async ({address}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
      const response = await MetisSBT.connect(admin).setMetisVote(address)

      console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        console.log(chalk.green('Done!'))
      } else {
        console.log(chalk.red('Failed!'))
      }
    })
}
