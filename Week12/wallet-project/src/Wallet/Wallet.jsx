import * as ethers from "ethers";
import { createPk } from "./CreatePrivateKey";

export class Wallet {
  mnemonic;
  seedUint8;
  seedHex;
  chainId;
  currentNonce;
  currentAddress;
  currentPrivateKeyToSign;

  accountsEVM = [];
  assets = [];
  activity = [];

  constructor(_mnemonic, _privateKeyUint8, _privateKeyHex) {
    this.mnemonic = _mnemonic;
    this.seedUint8 = _privateKeyUint8;
    this.seedHex = _privateKeyHex;
    this.chainId = 80001; //Only compatible with Mumbai for now
    this.setupWallet();
  }

  get mnemonic() {
    return this.mnemonic;
  }

  get assets() {
    return this.assets;
  }

  get activity() {
    return this.activity;
  }

  get currentAddress() {
    return this.currentAddress;
  }

  get currentPrivateKeyToSign() {
    return this.currentPrivateKeyToSign;
  }

  get numberOfAccounts() {
    return this.accountsEVM.length;
  }

  signTransaction() {}

  setupWallet() {
    //instanciate the  Hierarchical Deterministic Node
    const HD_NODE = ethers.utils.HDNode.fromMnemonic(this.mnemonic);
    //setup first private
    const firstPrivateKey = HD_NODE.privateKey;
    //setup first address(account)
    const firstAccount = HD_NODE.address;

    //Account and private key MUST have the same index
    const account = {
      address: firstAccount,
      privateKey: firstPrivateKey,
      nonce: 0,
    };
    this.accountsEVM.push(account);
    this.currentAddress = account["address"];
    this.currentPrivateKeyToSign = account["privateKey"];
    this.currentNonce = account["nonce"];
  }

  createNewAccount() {
    //get mnemonic
    const _mnemomic = this.mnemonic;
    //get default ethereum path
    const _path = `m/44'/60'/0'/0/${this.numberOfAccounts}`;
    //get the current HDNODE
    const HD_NODE = ethers.utils.HDNode.fromMnemonic(_mnemomic);
    //derive a path to get a child node from our HDNode
    const childNode = HD_NODE.derivePath(_path);

    //push new private key
    const _privateKey = childNode.privateKey;

    //push new account
    const _address = ethers.utils.computeAddress(_privateKey);

    const account = {
      address: _address,
      privateKey: _privateKey,
      nonce: 0,
    };
    this.accountsEVM.push(account);
  }

  changeAccount(index) {
    if (index > this.accountsEVM.length - 1) {
      throw Error("Index greater than your account number");
    } else {
      //Account and private key MUST have the same index
      const _array = this.accountsEVM;
      const _account = _array[index];
      this.currentAddress = _account["address"];
      this.currentPrivateKeyToSign = _account["privateKey"];
      this.currentNonce = _account["nonce"];
    }
  }
}
