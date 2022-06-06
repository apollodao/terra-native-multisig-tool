# Apollo Multisig Tool

## Setup

1. Install terrad. Add your key to it.
2. Add a .env file with contents KEY_NAME=name.
3. Run `yarn` to install dependencies.

## Usage

- To sign a transaction run: `yarn run sign-tx <network> <contract> <action>`
- When we have enough signatures, to execute run: `yarn run execute-tx <network> <contract> <action>`
