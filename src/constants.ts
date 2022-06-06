import { LCDClient } from '@terra-money/terra.js';

export type Network = 'testnet' | 'mainnet' | 'classic';

export const multisigName = 'apollo-admin';

export const chainIDs = {
  mainnet: 'phoenix-1',
  testnet: 'pisco-1',
  classic: 'columbus-5'
};

const testnetLCD = new LCDClient({
  URL: 'https://pisco-lcd.terra.dev',
  chainID: chainIDs.testnet,
  gasPrices: { uusd: 0.15, uluna: 0.15 },
  gasAdjustment: 1.4,
  isClassic: false
});

const mainnetLCD = new LCDClient({
  URL: 'https://phoenix-lcd.terra.dev',
  chainID: chainIDs.mainnet,
  gasPrices: { uusd: 0.15, uluna: 0.01133 },
  gasAdjustment: 1.4,
  isClassic: false
});

const classicLCD = new LCDClient({
  URL: 'https://lcd.terra.dev',
  chainID: chainIDs.classic,
  gasPrices: { uusd: 0.15, uluna: 0.01133 },
  gasAdjustment: 1.4,
  isClassic: true
});

export const LCDs = {
  mainnet: mainnetLCD,
  testnet: testnetLCD,
  classic: classicLCD
};

export const codeIDs = {
  mainnet: {},
  testnet: {},
  classic: {}
};

export const contracts = {
  mainnet: {},
  testnet: {},
  classic: {}
};
