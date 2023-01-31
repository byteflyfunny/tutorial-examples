import { HardhatUserConfig } from 'hardhat/config';

require('@matterlabs/hardhat-zksync-deploy');
require('@matterlabs/hardhat-zksync-solc');

// dynamically changes endpoints for local tests
const zkSyncTestnet =
{
        url: 'http://localhost:3050',
        ethNetwork: 'http://localhost:8545',
        zksync: true,
        allowUnlimitedContractSize: true,
      }
    ;

const config: HardhatUserConfig = {
  zksolc: {
    version: '1.2.1',
    compilerSource: 'binary',
    settings: {},
  },
  defaultNetwork: 'zkSyncTestnet',
  networks: {
    hardhat: {
      // @ts-ignore
      zksync: true,
      allowUnlimitedContractSize: true,
    },
    zkSyncTestnet,
  },
  solidity: {
    version: '0.8.16',
  },
};

export default config;
