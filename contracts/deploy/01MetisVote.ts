import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/types'
import {printDeploySuccessful, printInfo} from '../utils'

const version = 'v1.0.0'
const ContractName = 'MetisVote'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, network} = hre
  const {deploy} = deployments
  const {deployer} = await getNamedAccounts()

  printInfo(`\n Deploying ${ContractName} contract on ${network.name}...`)

  const MetisSBT = await deployments.get('MetisSBT')

  const MetisVoteResult = await deploy(ContractName, {
    args: [MetisSBT.address],
    contract: ContractName,
    from: deployer,
    skipIfAlreadyDeployed: false
  })

  const metisVoteAddress = MetisVoteResult.address

  printDeploySuccessful(ContractName, metisVoteAddress)

  return true
}

export default func
const id = ContractName + version
func.dependencies = ['MetisSBT' + version]
func.tags = [id, version]
func.id = id
