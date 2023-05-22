import {task, types} from 'hardhat/config'
import chalk from 'chalk'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {MetisVote} from '../typechain-types'

export const tasks = () => {
  task('election-info', 'Create Metis Election')
    .addParam('electionId', 'Election ID')
    .setAction(async ({electionId}, {ethers}) => {
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')

      const electionInfo = await MetisVote.elections(electionId)

      console.log(chalk.yellow('Election Info'))
      console.log(chalk.yellow(electionInfo))
    })
}
