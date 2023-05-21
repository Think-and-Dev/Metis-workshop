import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {task, types} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {printError, printInfo, printSuccess} from '../utils'
import {MetisVote} from '../typechain-types'

const addCandidate = async (hre: HardhatRuntimeEnvironment, contract: string, electionId: string, party, person) => {
  const [admin]: SignerWithAddress[] = await hre.ethers.getSigners()
  console.log(admin)
  const MetisVote: MetisVote = await hre.ethers.getContractAt('MetisVote', contract)
  const response = await MetisVote.connect(admin).addCandidate(electionId, party, person)
  console.log(response)
  //printInfo(`Transaction hash: ${response.hash}`)
  // const receipt = await response.wait()
  // if (receipt.status !== 0) {
  //   printSuccess('Done!')
  // } else {
  //   printError('Failed!')
  // }
}

export const tasks = () => {
  task('add-candidate', 'Create Metis Candidate for Election')
    .addParam('contract', 'MetisVote')
    .addParam('electionId', 'Election ID')
    .addParam('party', 'Party of the candidate')
    .addParam('person', 'address of the candidate')
    .setAction(async ({contract, electionId, party, person}, hre) => {
      await addCandidate(hre, contract, electionId, party, person)
    })

  task('add-candidates', 'Create Metis Candidates for same election')
    .addParam('electionId', 'Election ID')
    .addParam('parties', 'array of candidates parties')
    .addParam('candidates', 'array of candidates')
    .setAction(async ({electionId, parties, candidates}, {ethers}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisVote: MetisVote = await ethers.getContract('MetisVote')
      const response = await MetisVote.connect(admin).addCandidates(electionId, parties, candidates)

      // printInfo(`Transaction hash: ${response.hash}`)
      // const receipt = await response.wait()
      // if (receipt.status !== 0) {
      //   printSuccess('Done!')
      // } else {
      //   printError('Failed!')
      // }
    })
}
