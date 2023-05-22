import chalk from 'chalk'
import {task} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {MetisSBT, MetisVote} from '../typechain-types'

export const tasks = () => {
  task('set-new-start-time', 'Set New Election start time')
    .addParam('electionId', 'Election ID')
    .addParam('newStartTime', 'New start time')
    .setAction(async ({electionId, newStartTime}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')
      const response = await MetisVote.connect(admin).changeStartTimeElection(electionId, newStartTime)

      console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        console.log(chalk.green('Done!'))
      } else {
        console.log(chalk.red('Failed!'))
      }
    })

  task('set-new-end-time', 'Set New Election start time')
    .addParam('electionId', 'Election ID')
    .addParam('newEndTime', 'New end time')
    .setAction(async ({electionId, newEndTime}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')
      const response = await MetisVote.connect(admin).changeEndTimeElection(electionId, newEndTime)

      console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        console.log(chalk.green('Done!'))
      } else {
        console.log(chalk.red('Failed!'))
      }
    })
}
