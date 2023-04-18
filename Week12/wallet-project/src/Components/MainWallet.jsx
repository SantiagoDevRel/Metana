import React, { useState } from "react";
import { createPk, mnemonicToUint8, uint8ToHex } from "../Wallet/CreatePrivateKey";
import { Wallet } from "../Wallet/Wallet";
import styles from "./MainWallet.module.css";

function CreateWallet(props) {
  const [pkCreated, setPkCreated] = useState(false);
  const [wallet, setWallet] = useState({});
  const [mnemonic, setMnemonic] = useState("");
  const [privateKeyHex, setPrivateKeyHex] = useState("");
  const [privateKeyUint8, setPrivateKeyUint8] = useState("");
  const [currentNonce, setCurrentNonce] = useState("");
  const [currentAccount, setCurrentAccount] = useState("0x");
  const [currentSigner, setCurrentSigner] = useState("0x");

  /**
   * This function is to send the current wallet instance to the parent
   */
  const handleWallet = () => {
    console.log("sending wallet", wallet);
    props.mainWallet(wallet);
  };

  /*
   *the user first needs to call createPrivateKey()
   *this will create a new mnemonic == seed phrase
   *using this information, we can later then create the wallet
   */
  async function createPrivateKey() {
    const _mnemomic = createPk();
    setMnemonic(_mnemomic);
    const _uint8 = mnemonicToUint8(_mnemomic);
    setPrivateKeyUint8(_uint8);
    const _hexPK = uint8ToHex(_uint8);
    setPrivateKeyHex(_hexPK);
    setPkCreated(true);
  }

  /*
   *the user will create a new wallet with the previous mnemonic created
   */
  async function createNewWallet(_mnemonic, _privateKeyUint8, _privateKeyHex) {
    if (!pkCreated) {
      //user MUST create a private key first
      console.log("please create a private key first.");
    } else {
      const _wallet = new Wallet(_mnemonic, _privateKeyUint8, _privateKeyHex);
      setWallet(_wallet);
      setCurrentAccount(_wallet.currentAddress);
      setCurrentNonce(_wallet.currentNonce);
      setCurrentSigner(_wallet.currentPrivateKeyToSign);
    }
  }

  async function createNewAccount() {
    wallet.createNewAccount();
  }

  async function changeAccount(index) {
    if (!wallet.changeAccount(index)) {
      //manage error if the user wants to change to an inexisting address
      console.log("ERROR CHANGING ACCOUNT");
    } else {
      setCurrentAccount(wallet.currentAddress);
      setCurrentNonce(wallet.currentNonce);
      setCurrentSigner(wallet.currentPrivateKeyToSign);
      console.log("CURRENT ADDRESS:", wallet.currentAddress);
    }
  }

  function printWallet() {
    const pk = wallet.currentPrivateKeyToSign;
    console.log("PK GET", pk);
    console.log(wallet);
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.container}>
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
        <button onClick={() => handleWallet()}>handle wallet</button>
      </div>
      <div className={styles.container}>
        <h2>Accounts</h2>
        <h2> right square</h2>
      </div>
    </div>
  );
}

export default CreateWallet;
