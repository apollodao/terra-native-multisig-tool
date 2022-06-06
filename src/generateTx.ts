import { Tx, Wallet } from '@terra-money/terra.js';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import { contracts, codeIDs, LCDs, multisigName, Network } from './constants';
import fs from 'fs';
import { uploadContract } from './contracts/general';

export async function generateTx(
  network: Network,
  contractName: string,
  action: string,
  args: string[]
) {
  //Check if unsigned tx already exists. Otherwise generate it.
  const path = `./unsignedTx/${network}/${contractName}/${action}.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path).toString());
    return Tx.fromData(data);
  }

  const lcd = LCDs[network];

  const multisigKey = new CLIKey({ keyName: multisigName });
  const multisigAddress = multisigKey.accAddress;

  const multisigWallet = new Wallet(lcd, multisigKey);

  let tx: Tx;
  if (contractName === 'example-contract') {
    if (action === 'upload') {
      const file = '../artifacts/example.wasm';
      tx = await uploadContract(multisigWallet, file);
    } else process.exit();
  } else process.exit();

  //Write unsigned tx to disk
  const dir = `./unsignedTx/${network}/${contractName}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const writePath = `${dir}/${action}.json`;
  // @ts-ignore
  fs.writeFileSync(writePath, JSON.stringify(tx.toData()));

  console.log(`Unsigned tx written to ${writePath}`);

  // @ts-ignore
  return tx;
}
