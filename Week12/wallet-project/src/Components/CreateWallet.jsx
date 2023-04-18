import React, { useState } from "react";
import { createPk, mnemonicToUint8, uint8ToHex } from "../Wallet/CreatePrivateKey";
import { Wallet } from "../Wallet/Wallet";
import Footer from "./Footer";

function CreateWallet() {
  let mainWallet;
  const [wallet, setWallet] = useState({});
  const [mnemonic, setMnemonic] = useState("");
  const [privateKeyHex, setPrivateKeyHex] = useState("");
  const [privateKeyUint8, setPrivateKeyUint8] = useState("");
  const [nonce, setNonce] = useState("");
  const [currentAccount, setCurrentAccount] = useState("0x");

  async function createPrivateKey() {
    const _mnemomic = createPk();
    setMnemonic(_mnemomic);
    const _uint8 = mnemonicToUint8(_mnemomic);
    setPrivateKeyUint8(_uint8);
    const _hexPK = uint8ToHex(_uint8);
    setPrivateKeyHex(_hexPK);
  }

  async function createNewWallet(_mnemonic, _privateKeyUint8, _privateKeyHex) {
    const _wallet = new Wallet(_mnemonic, _privateKeyUint8, _privateKeyHex);
    setNonce(_wallet.nonce);
    setWallet(_wallet);
    setCurrentAccount(_wallet.currentAddress);
    //setAccount(_wallet.address);
    //console.log(mainWallet);
  }

  async function createNewAccount() {
    wallet.createNewAccount();
  }

  async function changeAccount(index) {
    wallet.changeAccount(index);
    console.log("CURRENT ADDRESS:", wallet.currentAddress);
    setCurrentAccount(wallet.currentAddress);
  }

  function printWallet() {
    const pk = wallet.currentPrivateKeyToSign;
    console.log("PK GET", pk);
    console.log(wallet);
  }

  return (
    <div>
      <button onClick={() => createPrivateKey()}>Create new random Private Key</button>
      <div>
        <p>{mnemonic}</p>
      </div>
      <button onClick={() => createNewWallet(mnemonic, privateKeyUint8, privateKeyHex)}>Create new wallet</button>
      <button onClick={() => createNewAccount()}>Create new account</button>
      <button onClick={() => changeAccount(1)}>change account 1</button>
      <button onClick={() => changeAccount(2)}>change account 2</button>
      <button onClick={() => changeAccount(3)}>change account 3</button>
      <button onClick={() => printWallet()}>PRINT WALLET</button>

      <Footer nonce={nonce} currentAccount={currentAccount} />
    </div>
  );
}

export default CreateWallet;
