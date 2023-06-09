import {HardhatRuntimeEnvironment} from 'hardhat/types'
import chalk from 'chalk'
import {task, types} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {MetisVote} from '../typechain-types'
import {keccak256, toUtf8Bytes} from 'ethers/lib/utils'
import {getBlockTimestamp} from '../utils'

const addCandidate = async (hre: HardhatRuntimeEnvironment, electionId: string, party: string, person: string) => {
  const [admin]: SignerWithAddress[] = await hre.ethers.getSigners()
  const MetisVote: MetisVote = await hre.ethers.getContract('MetisVote')
  const hashedParty = keccak256(toUtf8Bytes(party))
  const response = await MetisVote.connect(admin).addCandidate(electionId, hashedParty, person)

  console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
  const receipt = await response.wait()
  if (receipt.status !== 0) {
    console.log(chalk.green('Done!'))
  } else {
    console.log(chalk.red('Failed!'))
  }
}

export const tasks = () => {
  task('add-candidate', 'Create Metis Candidate for Election')
    .addParam('electionId', 'Election ID')
    .addParam('party', 'Party of the candidate')
    .addParam('person', 'address of the candidate')
    .setAction(async ({electionId, party, person}, hre) => {
      await addCandidate(hre, electionId, party, person)
    })

  task('add-candidates', 'Create Metis Candidates for same election')
    .addParam('electionId', 'Election ID')
    .addParam('parties', 'array of candidates parties')
    .addParam('candidates', 'array of candidates')
    .setAction(async ({electionId, parties, candidates}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')
      const response = await MetisVote.connect(admin).addCandidates(electionId, parties, candidates)

      console.log(chalk.yellow(`Transaction hash: ${response.hash}`))
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        console.log(chalk.green('Done!'))
      } else {
        console.log(chalk.red('Failed!'))
      }
    })
}
