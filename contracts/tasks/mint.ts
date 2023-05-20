import {task} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {printError, printInfo, printSuccess} from '../utils'
import {MetisSBT} from '../typechain-types'

export const tasks = () => {
  task('mint', 'Mint MetisSBT')
    .addParam('to', 'Address receiving SBT')
    .addParam('uri', 'Token URI')
    .setAction(async ({to, uri}, {deployments, ethers, network}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
      const response = await MetisSBT.connect(admin).mint(to, uri)

      printInfo(`Transaction hash: ${response.hash}`)
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        printSuccess('Done!')
      } else {
        printError('Failed!')
      }
    })
}
