import { LegacyAminoMultisigPublicKey } from '@terra-money/terra.js';
import { execSync } from 'child_process';

function generateCommand(args: string, home?: string) {
  return `terrad ${args} --output json ${home ? `--home ${home}` : ''}`;
}

export function getMultisigPublicKey(keyName: string) {
  const details = JSON.parse(
    execSync(generateCommand(`keys show ${keyName}`)).toString()
  );

  const publicKey = LegacyAminoMultisigPublicKey.fromData(
    JSON.parse(details.pubkey)
  );
  return publicKey;
}
