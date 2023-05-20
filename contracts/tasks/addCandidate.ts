import {task} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {printError, printInfo, printSuccess} from '../utils'
import {MetisVote} from '../typechain-types'

export const tasks = () => {
  task('add-candidate', 'Create Metis Candidate for Election')
    .addParam('election-id', 'Election ID')
    .addParam('party', 'Party of the candidate')
    .addParam('person', 'address of the candidate')
    .setAction(async ({electionId, party, person}, {deployments, ethers, network}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')
      const response = await MetisVote.connect(admin).addCandidate(electionId, party, person)

      printInfo(`Transaction hash: ${response.hash}`)
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        printSuccess('Done!')
      } else {
        printError('Failed!')
      }
    })

  task('add-candidates', 'Create Metis Candidates for same election')
    .addParam('election-id', 'Election ID')
    .addParam('parties', 'array of candidates parties')
    .addParam('candidates', 'array of candidates')
    .setAction(async ({electionId, parties, candidates}, {deployments, ethers, network}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')
      const response = await MetisVote.connect(admin).addCandidates(electionId, parties, candidates)

      printInfo(`Transaction hash: ${response.hash}`)
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        printSuccess('Done!')
      } else {
        printError('Failed!')
      }
    })
}
