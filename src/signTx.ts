import { MnemonicKey, SignDoc, Tx } from '@terra-money/terra.js';
import fs from 'fs';
import { LCDs, multisigName } from './constants';
import { generateTx } from './generateTx';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import env from './env';

// Usage: yarn run sign-tx <network> <contract> <action>
// where <network> is either "mainnet" or "testnet", <contract> is the contract
// name, eg "warchest"
async function signTx() {
  var args = process.argv.slice(2);

  const network = args[0];
  if (network !== 'testnet' && network !== 'mainnet' && network !== 'classic') {
    console.log(`Wrong network.`);
    process.exit();
  }

  const lcd = LCDs[network];

  let signerKey;
  let multisigAddress;
  const signerName = env.KEY_NAME;

  const mnemonic = process.env['MNEMONIC'];
  if (mnemonic) {
    multisigAddress = 'terra1qye46hulwvl0n2q4us7u69j2emz228jnzswqp0';
    signerKey = new MnemonicKey({
      mnemonic
    });
  } else {
    const multisigKey = new CLIKey({ keyName: multisigName });
    multisigAddress = multisigKey.accAddress;

    if (!signerName) {
      console.log(`No signer name`);
      process.exit();
    }
    signerKey = new CLIKey({
      keyName: signerName,
      multisig: multisigAddress
    });
  }

  const contractName = args[1];
  let action = args[2];

  let generateTxArgs = args.slice(3);

  let tx: Tx = await generateTx(network, contractName, action, generateTxArgs);

  const accInfo = await lcd.auth.accountInfo(multisigAddress);
  const signature = await signerKey.createSignatureAmino(
    new SignDoc(
      lcd.config.chainID,
      accInfo.getAccountNumber(),
      accInfo.getSequenceNumber(),
      tx.auth_info,
      tx.body
    )
  );

  //Write signature to disk
  const dir = `./signatures/${network}/${contractName}/${action}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const writePath = `${dir}/${signerName}.json`;
  fs.writeFileSync(
    writePath,
    JSON.stringify({
      public_key: signature.public_key.toData(),
      data: { single: signature.data.single },
      sequence: signature.sequence
    })
  );

  console.log(`Signature written to ${writePath}`);
}

signTx();
