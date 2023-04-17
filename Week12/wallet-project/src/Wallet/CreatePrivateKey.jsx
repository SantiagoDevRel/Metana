import * as ethers from "ethers";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

export function createPk() {
  // Generate x random words. Uses Cryptographically-Secure Random Number Generator.
  const mnemonic = bip39.generateMnemonic(wordlist);

  // Validates mnemonic for being 12-24 words contained in `wordlist`.
  //const verifyMnemonic = bip39.validateMnemonic(mnemonic, wordlist);

  return mnemonic;

  //~~~~~~~~~~~~~~ 2ND OPTION ~~~~~~~~~~~~~~
  //instead of using bip39 library, I can generate an Uint8Array(64) of random numbers from 0 to 255
  //then convert this array to hex
  //but in this case there won't be an "mnemonic"
}

export function mnemonicToUint8(mnemonic) {
  // Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
  //derive seed from the mnemonic (uint8Array of 64)
  const seedUint8 = bip39.mnemonicToSeedSync(mnemonic);
  return seedUint8;
}

export function uint8ToHex(arrayUint8) {
  const seedHex = ethers.utils.hexlify(arrayUint8);
  return seedHex;
}
