import { Wallet, Provider, Contract } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/zkToken.sol/zkToken.json";

// Address of the contract on zksync testnet
const TOKEN_ADDRESS = "0x5fE58d975604E6aF62328d9E505181B94Fc0718C";
var fs = require("fs");


if (!TOKEN_ADDRESS) throw "⛔️ ERC20 token address not provided";

var tokenContract:Contract;

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to transfer token ${TOKEN_ADDRESS}`);
  const csvfile = '.secret.csv';
  // Initialize the signer.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new Wallet(PRIVATE_KEY, provider);
  tokenContract = new Contract(
    TOKEN_ADDRESS,
    ContractArtifact.abi,
    signer
    );
    let lines:string[] = read_csv_line(csvfile)

    for (let line of lines){
        console.log(`Line content is ${line[1]}`)
        const account = new Wallet(line[0],provider)

        const AMOUNT = "1000";
        console.log(
            `Account ${signer.address} balance is: ${await tokenContract.balanceOf(
            signer.address
            )} tokens`
        );
        console.log(
            `Account ${account.address} balance is: ${await tokenContract.balanceOf(
            account.address
            )} tokens`
        );
                //   transfer tokens
        const transferHandle = await tokenContract.transfer(
            account.address,
            ethers.utils.parseEther(AMOUNT)
        );


        //   Wait until the transaction is processed on zkSync
        await transferHandle.wait();

        console.log(`Transfer completed in trx ${transferHandle.hash}`);
        console.log(
            `Account ${signer.address} balance now is: ${await tokenContract.balanceOf(
            signer.address
            )} tokens`
        );
        console.log(
            `Account ${account.address} balance now is: ${await tokenContract.balanceOf(
            account.address
            )} tokens`
        );

        const transfer = await signer.transfer({
            to: account.address,
            amount: ethers.utils.parseEther(AMOUNT)
          });
        const transferReceipt = await transfer.wait();
        console.log(`Transfer native token eth completed in trx ${transferReceipt.blockHash}`);

        console.log(
            `Account ${account.address} eth balance now is: ${await signer.getBalance()} tokens`
        );
    }
}


export function read_csv_line(csvfile: string): string[]{
    let csvstr: string = fs.readFileSync(csvfile,"utf8",'r+');
    console.log(`line is ${csvstr}`)
    let arr: string[] = csvstr.split('\n');
    let array: any = [];
    arr.forEach(line => {
      array.push(line.split(','));
    });
    return array
}



