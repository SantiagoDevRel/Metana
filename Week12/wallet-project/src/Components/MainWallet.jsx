import React, { useEffect, useState } from "react";
import { createPk, mnemonicToUint8, uint8ToHex } from "../Wallet/CreatePrivateKey";
import { Wallet } from "../Wallet/Wallet";
import styles from "./MainWallet.module.css";

let listAccounts = [];

function CreateWallet(props) {
  const [numberAccounts, setNumberAccounts] = useState(0);
  const [allAddresses, setAllAddresses] = useState([]);
  const [pkCreated, setPkCreated] = useState(false);
  const [wallet, setWallet] = useState({});
  const [mnemonic, setMnemonic] = useState("");
  const [privateKeyHex, setPrivateKeyHex] = useState("");
  const [privateKeyUint8, setPrivateKeyUint8] = useState("");
  const [currentNonce, setCurrentNonce] = useState("");
  const [currentAccount, setCurrentAccount] = useState("0x");
  const [currentSigner, setCurrentSigner] = useState("0x");

  useEffect(() => {
    createPrivateKey();
  }, []);

  /**
   * This function is to send the current wallet instance to the parent
   */
  const handleWallet = (wallet) => {
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
      setNumberAccounts(_wallet.numberOfAccounts);
      setAllAddresses(_wallet.allAddresses);
      listAccounts.push(_wallet.currentAddress);
      console.log("LIST", listAccounts);

      handleWallet(_wallet);
    }
  }

  async function createNewAccount() {
    const newAddress = wallet.createNewAccount();
    setNumberAccounts(wallet.numberOfAccounts);
    setAllAddresses(wallet.allAddresses);

    listAccounts.push(newAddress);
    console.log("LIST", listAccounts);
    setAllAddresses();
    handleWallet(wallet);
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
      handleWallet(wallet);
    }
  }
  function handleChangeAccount(event) {
    event.preventDefault();
    console.log("number", num);
  }

  //DELETE
  function printWallet() {
    const pk = wallet.currentPrivateKeyToSign;
    console.log("PK GET", pk);
    console.log(wallet);
  }

  return (
    <>
      <button onClick={() => createPrivateKey()}>Create new seed phrase</button>
      <div>
        <p>{mnemonic}</p>
      </div>
      <div className={styles.main_container}>
        <div className={styles.container}>
          <h4>Functionalities</h4>
          <button onClick={() => createNewWallet(mnemonic, privateKeyUint8, privateKeyHex)}>Create first account</button>
          <button onClick={() => createNewAccount()}>Create new account</button>
          <form onSubmit={handleChangeAccount}>
            <label>
              <button>Choose your account</button>
              <input type="number" name="num" onChange={handleChangeAccount}></input>
            </label>
          </form>

          <button onClick={() => printWallet()}>PRINT WALLET</button>
        </div>
        <div className={styles.container}>
          <h4>Accounts {numberAccounts}</h4>
          <div className={styles.addresses}>
            {listAccounts.map((key, index) => {
              return <button style={{ backgroundColor: key === currentAccount ? "green" : "" }}>{`#${index} :` + key}</button>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateWallet;
