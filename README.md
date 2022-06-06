# Apollo Multisig Tool

## Setup

1. Install terrad. Add your key to it.
2. Add a `.env` file in the root dir with contents `KEY_NAME=name`.
3. Run `yarn` to install dependencies.

If you have problems using terrad, for example if using an M1 Mac, you can
instead put your seed phrase in your `.env` file. You will also need to add
the address of your multisig, like so:

```
MNEMONIC=seed phrase here
MULTISIG_ADDRESS=terra1...
```

## Usage

- To sign a transaction run: `yarn run sign-tx <network> <contract> <action>`
- When we have enough signatures, to execute run: `yarn run execute-tx <network> <contract> <action>`
