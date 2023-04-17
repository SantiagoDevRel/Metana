import * as ethers from "ethers";
import { createPk } from "./CreatePrivateKey";

export class Wallet {
  chainId;
  provider;
  nonce;
  privateKey;
  accounts = [];
  assets = [];
  activity = [];

  constructor(_privateKey) {
    this.nonce = 0;
    this.privateKey = _privateKey;
    this.chainId = 80001; //Only compatible with Mumbai for now
  }

  signTransaction() {}

  createNewAccount() {}

  changeAccount() {}
}

export const wallet = new Wallet();
