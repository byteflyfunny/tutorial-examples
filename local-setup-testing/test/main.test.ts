import { expect } from 'chai';
import { Wallet, Contract, utils } from 'zksync-web3';
import * as hre from 'hardhat';
import { ethers } from 'ethers';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

const RICH_WALLET_PK =
  '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';

async function deployGreeter(deployer: Deployer): Promise<Contract> {
  try {
    console.log('Deploying contract');
    const artifact = await deployer.loadArtifact('Greeter');

    return await deployer.deploy(artifact, ['Hi']);
  } catch (error) {
    console.error('Error deploying contract');
    console.error(error);
    throw new Error('Error deploying contract');
  }
}

async function deployToken(deployer: Deployer): Promise<Contract> {
  try {
    console.log('Deploying erc20 contract');
    const artifact = await deployer.loadArtifact('zkToken');

    return await deployer.deploy(artifact);
  } catch (error) {
    console.error('Error deploying erc20 contract');
    console.error(error);
    throw new Error('Error deploying erc20 contract');
  }
}

async function deployNFT(deployer: Deployer): Promise<Contract> {
  try {
    console.log('Deploying nft contract');
    const artifact = await deployer.loadArtifact('zkNFT');

    return await deployer.deploy(artifact);
  } catch (error) {
    console.error('Error deploying nft contract');
    console.error(error);
    throw new Error('Error deploying nft contract');
  }
}

describe('Greeter', function () {
  let deployer: Deployer;

  before('Fund the wallet', async () => {
    deployer = new Deployer(hre, new Wallet(RICH_WALLET_PK));

    const depositHandle = await deployer.zkWallet.deposit({
      to: deployer.zkWallet.address,
      token: utils.ETH_ADDRESS,
      amount: ethers.utils.parseEther('0.001'),
    });

    await depositHandle.wait();
  });

  it("Should return the new greeting once it's changed", async () => {
    const greeter = await deployGreeter(deployer);
    console.log('Contract deployed');
    expect(await greeter.greet()).to.eq('Hi');

    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});


describe('Erc20', function () {
  let deployer: Deployer;

  before('Fund the wallet', async () => {
    deployer = new Deployer(hre, new Wallet(RICH_WALLET_PK));

    const depositHandle = await deployer.zkWallet.deposit({
      to: deployer.zkWallet.address,
      token: utils.ETH_ADDRESS,
      amount: ethers.utils.parseEther('0.001'),
    });

    await depositHandle.wait();
  });

  it("Should return erc20 address", async () => {
    const contract = await deployToken(deployer);
    console.log('Contract deployed');

      // Show the contract info.
    const contractAddress = contract.address;
    console.log(`erc20 was deployed to ${contractAddress}`);
    
  });
});

