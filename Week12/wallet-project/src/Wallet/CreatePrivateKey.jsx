import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

export async function main() {
  // Generate x random words. Uses Cryptographically-Secure Random Number Generator.
  const mn = bip39.generateMnemonic(wordlist);
  console.log(mn);

  // Reversible: Converts mnemonic string to raw entropy in form of byte array.
  const ent = bip39.mnemonicToEntropy(mn, wordlist);
  console.log(ent);

  // Reversible: Converts raw entropy in form of byte array to mnemonic string.
  const check1 = bip39.entropyToMnemonic(ent, wordlist);
  console.log(check1);
  // Validates mnemonic for being 12-24 words contained in `wordlist`.
  const check2 = bip39.validateMnemonic(mn, wordlist);
  console.log(check2);

  // Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
  await bip39.mnemonicToSeed(mn, "password");
  bip39.mnemonicToSeedSync(mn, "password");
}
main();
