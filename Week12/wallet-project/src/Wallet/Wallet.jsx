import * as ethers from "ethers";
import { createPk } from "./CreatePrivateKey";

export class Wallet {
  mnemonic;
  seedUint8;
  seedHex;
  chainId;
  nonce;
  currentAccount;
  currentPrivateKeyToSign;

  privateKeysEVM = [];
  accountsEVM = [];
  assets = [];
  activity = [];

  constructor(_mnemonic, _privateKeyUint8, _privateKeyHex) {
    this.nonce = 0;
    this.mnemonic = _mnemonic;
    this.seedUint8 = _privateKeyUint8;
    this.seedHex = _privateKeyHex;
    this.chainId = 80001; //Only compatible with Mumbai for now
    this.setupWallet();
  }

  get nonce() {
    return this.nonce;
  }

  get privateKeysEVM() {
    return this.privateKeysEVM;
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
    return this.currentAccount;
  }

  get currentPrivateKeyToSign() {
    return this.currentPrivateKeyToSign;
  }

  signTransaction() {}

  setupWallet() {
    //instanciate the  Hierarchical Deterministic Node
    const HD_NODE = ethers.utils.HDNode.fromMnemonic(this.mnemonic);
    //setup first private
    const firstPrivateKey = HD_NODE.privateKey;
    this.privateKeysEVM.push(firstPrivateKey);
    //setup first address(account)
    const firstAccount = HD_NODE.address;
    this.accountsEVM.push(firstAccount);

    //Account and private key MUST have the same index
    const arrayAccounts = this.accountsEVM;
    const arrayPrivateKeys = this.privateKeysEVM;
    this.currentAccount = arrayAccounts[0];
    this.currentPrivateKeyToSign = arrayPrivateKeys[0];
  }

  createNewAccount() {
    //get mnemonic
    const _mnemomic = this.mnemonic;
    //get default ethereum path
    const _path = ethers.utils.defaultPath;
    //get the current HDNODE
    const HD_NODE = ethers.utils.HDNode.fromMnemonic(_mnemomic);
    //derive a path to get a child node from our HDNode
    const childNode = HD_NODE.derivePath(_path);

    //push new private key
    const privateKey = childNode.privateKey;
    this.privateKeysEVM.push(privateKey);

    //push new account
    const address = ethers.utils.computeAddress(privateKey);
    this.accountsEVM.push(address);
  }

  changeAccount(index) {
    if (index > this.accountsEVM.length - 1) {
      throw Error("Index greater than your account number");
    } else {
      //Account and private key MUST have the same index
      const arrayAccounts = this.accountsEVM;
      const arrayPrivateKeys = this.privateKeysEVM;
      this.currentAccount = arrayAccounts[index];
      this.currentPrivateKeyToSign = arrayPrivateKeys[index];
    }
  }
}
