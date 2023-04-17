import * as ethers from "ethers";
import { createPk } from "./CreatePrivateKey";

export class Wallet {
  chainId;
  provider;
  nonce;
  mnemonic;
  privateKeyUint8;
  privateKeyHex;

  accounts = [];
  assets = [];
  activity = [];

  constructor(_mnemonic, _privateKeyUint8, _privateKeyHex) {
    this.nonce = 0;
    this.mnemonic = _mnemonic;
    this.privateKeyUint8 = _privateKeyUint8;
    this.privateKeyHex = _privateKeyHex;

    this.chainId = 80001; //Only compatible with Mumbai for now
  }

  signTransaction() {}

  createNewAccount() {}

  changeAccount() {}
}
