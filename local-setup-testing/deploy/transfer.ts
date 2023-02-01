import { Wallet, Provider, Contract } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
const NUMBER = 30;
if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";
const uint8 = new Uint8Array(1);
uint8[0] = 0;

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/zkToken.sol/zkToken.json";


// Address of the contract on zksync testnet
const TOKEN_ADDRESS = "0x5fE58d975604E6aF62328d9E505181B94Fc0718C";


var fs = require("fs");
const DESTINATION_WALLET = "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049";


if (!TOKEN_ADDRESS) throw "⛔️ ERC20 token address not provided";

var provider:Provider;

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to transfer token ${TOKEN_ADDRESS}`);
  const csvfile = '.secret.csv';
  // Initialize the signer.
  // @ts-ignore
  provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  
  const signer = new Wallet(PRIVATE_KEY, provider);
    const tokenContract = new Contract(
      TOKEN_ADDRESS,
      ContractArtifact.abi,
      signer
    );
    
    const counter = await tokenContract.getCounter();

    let lines:string[] = read_csv_line(csvfile);

    var start = Date.now();
    console.log(`start time ${start}`); 
    for (var line of lines){
        if (line.length > 2) {
            console.log(`Line content is ${line[1]}`)
            tranfer(line[0])
        }
    }

    do {
        var newCounter = await tokenContract.getCounter()
    }
    while (newCounter<counter + lines.length);
    var end = Date.now()
    console.log(`end time ${end}`); 
    console.log(`total cost ${end-start}`)
}


export function read_csv_line(csvfile: string): string[]{
    let csvstr: string = fs.readFileSync(csvfile,"utf8",'r+');
    let arr: string[] = csvstr.split('\n');
    let array: any = [];
    arr.forEach(line => {
        let elms = line.split(',');
        if (elms.length >2 ) {
            array.push(elms);
        }
    });
    return array
}


async function tranfer(privateKey : string) {
    const account = new Wallet(privateKey, provider);
    const tokenContract = new Contract(
      TOKEN_ADDRESS,
      ContractArtifact.abi,
      account
    );
    
    const AMOUNT = "1.0";
            //   transfer tokens

    for(var i = 10;i>=1;i--) {

        //use wallet transfer
        const transfer = await account.transfer({
            to: DESTINATION_WALLET,
            token: TOKEN_ADDRESS,
            amount: ethers.utils.parseEther(AMOUNT),
          });
        const transferReceipt = await transfer.wait();
        console.log(`Transfer completed in trx ${transferReceipt.blockHash}`);


        //   transfer tokens
        // const transferHandle = await tokenContract.transfer(
        //     DESTINATION_WALLET,
        //     ethers.utils.parseEther(AMOUNT),
        //     {gasLimit:3000000}
        // );
        // //   Wait until the transaction is processed on zkSync
        // await transferHandle.wait();
        // console.log(`Transfer completed in trx ${transferHandle.hash}`);
    }

    const tx = await tokenContract.increase();
    await tx.wait();
    console.log(`Counter now is ${await tokenContract.getCounter()}`);
}


