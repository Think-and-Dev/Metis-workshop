import {task, types} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {printError, printInfo, printSuccess} from '../utils'
import {createSafeTransaction, getSafeSDK, proposeTransaction} from '../utils/safe'

export const tasks = () => {
  task('mint', 'Mint MetisSBT')
    .addParam('limit', 'New Token withdrawal limit')
    .addParam('to', 'Address receiving SBT')
    .addParam('uri', 'Token URI')
    .setAction(async ({to, uri}, {deployments, ethers, network}) => {
      const {get} = deployments
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const contractFactory = await ethers.getContractFactory('MetisSBT')
      const contract = await contractFactory.connect(admin)
      const response = await contract.mint(to, uri)

      printInfo(`Transaction hash: ${response.hash}`)
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        printSuccess('Done!')
      } else {
        printError('Failed!')
      }
    })
}
