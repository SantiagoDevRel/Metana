import React, { useEffect, useState } from "react";
import { createPk, mnemonicToUint8, uint8ToHex } from "../Wallet/CreatePrivateKey";
import { Wallet } from "../Wallet/Wallet";
import styles from "./MainWallet.module.css";
import { useRef } from "react";
import * as ethers from "ethers";

let listAccounts = [];

function CreateWallet(props) {
  const numRef = useRef();
  const [numberAccounts, setNumberAccounts] = useState(0);
  const [allAddresses, setAllAddresses] = useState([]);
  const [accountCreated, setAccountCreated] = useState(false);
  const [wallet, setWallet] = useState({});
  const [mnemonic, setMnemonic] = useState("");
  const [privateKeyHex, setPrivateKeyHex] = useState("");
  const [privateKeyUint8, setPrivateKeyUint8] = useState("");
  const [currentNonce, setCurrentNonce] = useState("");
  const [currentAccount, setCurrentAccount] = useState("0x");
  const [currentSigner, setCurrentSigner] = useState("0x");
  const [signature, setSignature] = useState("0x");
  const [hash, setHash] = useState("");
  const [msg, setMsg] = useState("");

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
  }

  /*
   *the user will create a new wallet with the previous mnemonic created
   */
  async function createNewWallet(_mnemonic, _privateKeyUint8, _privateKeyHex) {
    const _wallet = new Wallet(_mnemonic, _privateKeyUint8, _privateKeyHex);
    setWallet(_wallet);
    setCurrentAccount(_wallet.currentAddress);
    setCurrentNonce(_wallet.currentNonce);
    setCurrentSigner(_wallet.currentPrivateKeyToSign);
    setNumberAccounts(_wallet.numberOfAccounts);
    setAllAddresses(_wallet.allAddresses);
    listAccounts.push(_wallet.currentAddress);
    setAccountCreated(true);
    handleWallet(_wallet);
  }

  async function createNewAccount() {
    if (!accountCreated) {
      //user MUST create a private key first
      alert("You must create the first account before continuing.");
    }
    if (listAccounts.length > 3) {
      alert("You can create only up to 4 wallets for learning purposes");
    } else {
      const newAddress = wallet.createNewAccount();
      setNumberAccounts(wallet.numberOfAccounts);
      setAllAddresses(wallet.allAddresses);

      listAccounts.push(newAddress);
      setAllAddresses();
      handleWallet(wallet);
    }
  }

  function changeAccount(index) {
    if (!wallet.changeAccount(index)) {
      //manage error if the user wants to change to an inexisting address
      alert("Invalid account number");
    } else {
      setCurrentAccount(wallet.currentAddress);
      setCurrentNonce(wallet.currentNonce);
      setCurrentSigner(wallet.currentPrivateKeyToSign);
      handleWallet(wallet);
    }
  }
  function handleChangeAccount(event) {
    if (!accountCreated) {
      //user MUST create a private key first
      alert("You must create the first account before continuing.");
    }
    event.preventDefault();
    const changeToNumber = parseInt(numRef.current.value);
    changeAccount(changeToNumber);
  }

  function handleHashing(event) {
    if (!accountCreated) {
      //user MUST create a private key first
      alert("You must create an account first.");
    } else {
      event.preventDefault();
      const _msg = event.target.value;
      //HASH MESSAGE + CURRENT NONCE TO PREVENT REPLAY ATTACK
      console.log("Current nonce", currentNonce);
      const _hash = ethers.utils.solidityKeccak256(["string", "uint256"], [_msg, currentNonce]);
      setHash(_hash);
      setMsg(`${_msg}` + `${currentNonce}`);
    }
  }

  async function handleSigning(event) {
    if (!accountCreated) {
      //user MUST create a private key first
      alert("You must create an account first.");
    } else {
      event.preventDefault();
      console.log("msg", msg);
      const signature = await wallet.signMessage(msg);
      console.log("signature", signature);
      setCurrentNonce(wallet.currentNonce);
      handleWallet(wallet);
      setSignature(signature);
    }
  }

  //DELETE
  function printWallet() {
    const pk = wallet.currentPrivateKeyToSign;
    console.log("PK GET", pk);
    console.log(wallet);
    console.log("verify:", ethers.utils.verifyMessage(msg, signature));
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
          {/* CREATE FIRST ACCOUNT */}
          <button onClick={() => createNewWallet(mnemonic, privateKeyUint8, privateKeyHex)}>1. Create first account</button>
          {/* CREATE NEW ACCOUNT */}
          <button onClick={() => createNewAccount()}>2. Create new account</button>

          {/* HASH A MESSAGE */}
          <button>3. Hash your message + the current nonce:</button>
          <div>
            <form>
              <label>
                <input className={styles.hashing} type="text" onChange={handleHashing} placeholder={"Insert your message here"}></input>
                <p className={styles.text}>{hash}</p>
              </label>
            </form>
          </div>
        </div>
        {/* SHOW ACCOUNTS - RIGHT CONTAINER */}
        <div className={styles.container}>
          <h4>Total Accounts: {numberAccounts}</h4>

          <div className={styles.addresses}>
            {/* CHANGE ACCOUNT */}
            <form onSubmit={handleChangeAccount}>
              <button type="submit">Select your account #</button>
              <input type="number" name="num" ref={numRef} defaultValue={0} min={0}></input>
            </form>

            {listAccounts.map((key, index) => {
              return (
                <button key={index} style={{ backgroundColor: key === currentAccount ? "green" : "" }}>
                  {`#${index} :` + key}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* SIGN THE HASH */}
      <div>
        <button onClick={() => handleSigning(event)}>4. Sign The hash:</button>
        <p className={styles.text}>{signature}</p>
      </div>
    </>
  );
}

export default CreateWallet;
