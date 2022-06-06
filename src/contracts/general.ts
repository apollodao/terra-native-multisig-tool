import { MsgStoreCode, Wallet } from '@terra-money/terra.js';
import * as fs from 'fs';

export async function uploadContract(wallet: Wallet, file: string) {
  const storeCode = new MsgStoreCode(
    wallet.key.accAddress,
    fs.readFileSync(file).toString('base64')
  );

  return wallet.createTx({ msgs: [storeCode], feeDenoms: ['uusd'] });
}
