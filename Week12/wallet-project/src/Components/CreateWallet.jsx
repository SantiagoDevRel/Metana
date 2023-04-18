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
  const [account, setAccount] = useState("0x");

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
    //setAccount(_wallet.address);
    //console.log(mainWallet);
  }

  async function createNewAccount() {
    console.log("call created");
    wallet.createNewAccount();
    console.log(wallet);
    console.log("call created");
  }

  return (
    <div>
      <button onClick={() => createPrivateKey()}>Create new random Private Key</button>
      <div>
        <p>{mnemonic}</p>
      </div>
      <button onClick={() => createNewWallet(mnemonic, privateKeyUint8, privateKeyHex)}>Create new wallet</button>
      <button onClick={() => createNewAccount()}>Create new account</button>
      <Footer nonce={1} />
    </div>
  );
}

export default CreateWallet;
