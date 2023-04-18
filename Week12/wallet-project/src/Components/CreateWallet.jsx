import React, { useState } from "react";
import { createPk, mnemonicToUint8, uint8ToHex } from "../Wallet/CreatePrivateKey";
import { Wallet } from "../Wallet/Wallet";

function CreateWallet() {
  const [mnemonic, setMnemonic] = useState("");
  const [privateKeyHex, setPrivateKeyHex] = useState("");
  const [privateKeyUint8, setPrivateKeyUint8] = useState("");

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
    console.log(_wallet);
  }

  return (
    <div>
      <button onClick={() => createPrivateKey()}>Create new random Private Key</button>
      <div>
        <p>{mnemonic}</p>
      </div>
      <button onClick={() => createNewWallet(mnemonic, privateKeyUint8, privateKeyHex)}>Create new wallet</button>
    </div>
  );
}

export default CreateWallet;
