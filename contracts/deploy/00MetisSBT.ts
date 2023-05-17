import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/types'
import {printDeploySuccessful, printInfo} from '../utils'

const version = 'v1.0.0'
const ContractName = 'MetisSBT'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, network} = hre
  const {deploy} = deployments
  const {deployer} = await getNamedAccounts()

  printInfo(`\nDeploying ${ContractName} contract on ${network.name}...`)

  const MetisSBTResult = await deploy(ContractName, {
    args: [],
    contract: ContractName,
    from: deployer,
    skipIfAlreadyDeployed: false
  })

  const metisSBTAddress = MetisSBTResult.address

  printDeploySuccessful(ContractName, metisSBTAddress)

  return true
}

export default func
const id = ContractName + version
func.tags = [id, version]
func.id = id
