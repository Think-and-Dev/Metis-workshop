const networks: any = {
  localhost: {
    chainId: 31337,
    url: 'http://127.0.0.1:8545',
    allowUnlimitedContractSize: true,
    timeout: 1000 * 60
  },
  hardhat: {
    live: false,
    allowUnlimitedContractSize: true,
    tags: ['test', 'local']
  },
  metis: {
    live: true,
    chainId: 599,
    url: 'https://goerli.gateway.metisdevops.link',
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : ''
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
    tags: ['metis', 'testnet']
  }
}

export default networks
