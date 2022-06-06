import { MultiSignature, SignatureV2, Tx } from '@terra-money/terra.js';
import { LCDs, multisigName } from './constants';
import fs from 'fs';
import { generateTx } from './generateTx';
import { getMultisigPublicKey } from './MultisigCLIKey';

// Usage: yarn run execute-tx <network> <contract> <action>
// where network is either "mainnet" or "testnet" and contract is the contract name, eg "warchest"
async function executeTx() {
  var args = process.argv.slice(2);

  const network = args[0];
  if (network !== 'testnet' && network !== 'mainnet' && network !== 'classic') {
    console.log(`Wrong network.`);
    process.exit();
  }

  const lcd = LCDs[network];

  const contractName = args[1];
  const action = args[2];

  let generateTxArgs = args.slice(3);
  let tx: Tx = await generateTx(network, contractName, action, generateTxArgs);

  const multisigPubkey = getMultisigPublicKey(multisigName);
  const multisigAddress = multisigPubkey.address();

  const multisig = new MultiSignature(multisigPubkey);

  //Read all signatures
  const signaturesFolder = `./signatures/${network}/${contractName}/${action}/`;
  const signatureFileNames = fs.readdirSync(signaturesFolder);
  const signatures: SignatureV2[] = [];
  for (let i = 0; i < signatureFileNames.length; i++) {
    const fileName = signatureFileNames[i];
    if (fileName === '.gitignore') continue;
    const rawSig = fs.readFileSync(`${signaturesFolder}${fileName}`).toString();
    const parsed = JSON.parse(rawSig);
    const sig = SignatureV2.fromData(parsed);
    signatures.push(sig);
  }
  multisig.appendSignatureV2s(signatures);

  //Create signed tx
  const accInfo = await lcd.auth.accountInfo(multisigAddress);
  tx.appendSignatures([
    new SignatureV2(
      multisigPubkey,
      multisig.toSignatureDescriptor(),
      accInfo.getSequenceNumber()
    )
  ]);

  //Write signed tx to disk
  const dir = `./signedTx/${network}/${contractName}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const writePath = `${dir}/${action}.json`;
  fs.writeFileSync(writePath, JSON.stringify(tx.toData()));
  console.log(`Signed Tx written to ${writePath}`);

  //Broadcast signed tx
  console.log(`Broadcasting signed tx...`);

  const res = await lcd.tx.broadcast(tx);
  console.log(`response: `, res);
}

executeTx();
