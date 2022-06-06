import { SignDoc, Tx, Wallet } from '@terra-money/terra.js';
import { LCDs } from './constants';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import env from './env';
import * as promptly from 'promptly';
import { uploadContract } from './contracts/general';

async function signAndExecuteTx() {
  var args = process.argv.slice(2);

  const network = args[0];
  if (network !== 'testnet' && network !== 'mainnet') {
    console.log(`Wrong network.`);
    process.exit();
  }

  const lcd = LCDs[network];

  const signerName = env.KEY_NAME;
  if (!signerName) {
    console.log(`No signer name`);
    process.exit();
  }
  const signerKey = new CLIKey({
    keyName: signerName
  });

  const walletAddress = signerKey.accAddress;
  const wallet = new Wallet(lcd, signerKey);

  console.log(`signerName: ${signerName}`);
  console.log(`signerWallet: ${wallet.key.accAddress}`);

  const contractName = args[1];
  let action = args[2];

  let generateTxArgs = args.slice(3);

  let tx: Tx;
  if (contractName === 'example-contract') {
    if (action === 'upload') {
      const file = '../artifacts/example.wasm';
      tx = await uploadContract(wallet, file);
    } else process.exit();
  } else process.exit();

  const accInfo = await lcd.auth.accountInfo(walletAddress);
  const signature = await signerKey.createSignatureAmino(
    new SignDoc(
      lcd.config.chainID,
      accInfo.getAccountNumber(),
      accInfo.getSequenceNumber(),
      tx.auth_info,
      tx.body
    )
  );

  tx.appendSignatures([signature]);

  //CLI confirmation
  console.log('\n' + JSON.stringify(tx).replace(/\\/g, '') + '\n');
  const proceed = await promptly.confirm(
    'Confirm transaction before broadcasting [y/N]:'
  );
  if (!proceed) {
    console.log('User aborted!');
    process.exit(1);
  }

  //Broadcast signed tx
  console.log(`Broadcasting signed tx...`);

  try {
    const res = await lcd.tx.broadcast(tx);
    console.log(`response: `, res);
  } catch (error: any) {
    console.log(`error: `, error);
  }
}

signAndExecuteTx();
