import {task} from 'hardhat/config'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {printError, printInfo, printSuccess} from '../utils'
import {MetisSBT} from '../typechain-types'

export const tasks = () => {
  task('lazymint', 'Lazy mint MetisSBTs').setAction(async ({}, {deployments, ethers, network}) => {
    const [admin]: SignerWithAddress[] = await ethers.getSigners()
    const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
    const response = await MetisSBT.connect(admin).safeLazyMint()

    printInfo(`Transaction hash: ${response.hash}`)
    const receipt = await response.wait()
    if (receipt.status !== 0) {
      printSuccess('Done!')
    } else {
      printError('Failed!')
    }
  })

  task('lazymintBatch', 'Lazy mint batch MetisSBTs')
    .addParam('quantity', 'Amount of sbts to lazy mint')
    .setAction(async ({quantity}, {deployments, ethers, network}) => {
      const [admin]: SignerWithAddress[] = await ethers.getSigners()
      const MetisSBT: MetisSBT = await ethers.getContract('MetisSBT')
      const response = await MetisSBT.connect(admin).safeLazyMintBatch(quantity)

      printInfo(`Transaction hash: ${response.hash}`)
      const receipt = await response.wait()
      if (receipt.status !== 0) {
        printSuccess('Done!')
      } else {
        printError('Failed!')
      }
    })
}
