import {task, types} from 'hardhat/config'
import chalk from 'chalk'
import {MetisVote} from '../typechain-types'

export const tasks = () => {
  task('election-info', 'Create Metis Election')
    .addParam('electionId', 'Election ID')
    .setAction(async ({electionId}, {ethers}) => {
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')

      const electionInfo = await MetisVote.elections(electionId)
      const isActive = await MetisVote.isActiveElection(electionId)

      console.log(chalk.yellow('---------- Election Info ----------'))
      if (isActive) {
        console.log(chalk.green('ACTIVE ELECTON'))
      } else {
        console.log(chalk.red('NOT ACTIVE ELECTION'))
      }

      console.log(chalk.green('---------- ELECTION POSITION ----------'))
      console.log(chalk.yellow(electionInfo[0]))

      console.log(chalk.green('---------- ELECTION START TIME ----------'))
      console.log(chalk.yellow(electionInfo[1]))

      console.log(chalk.green('---------- ELECTION END TIME ----------'))
      console.log(chalk.yellow(electionInfo[2]))
    })
}
