import {task} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {printError, printInfo, printSuccess} from '../utils'
import {MetisVote} from '../typechain-types'

export const tasks = () => {
  task('create-election', 'Create Metis Election')
    .addParam('position', 'election position name')
    .addParam('startTime', 'start time of the election')
    .addParam('endTime', 'end time of the election')
    .setAction(async ({position, startTime, endTime}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')
      const response = await MetisVote.connect(admin).createElection(position, startTime, endTime)

      // printInfo(`Transaction hash: ${response.hash}`)
      // const receipt = await response.wait()
      // if (receipt.status !== 0) {
      //   printSuccess('Done!')
      // } else {
      //   printError('Failed!')
      // }
    })
}
