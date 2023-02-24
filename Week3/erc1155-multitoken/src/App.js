import './App.css';
import { ethers } from "ethers";
import Tabs from './components/Tabs/Tabs';
import { useState, useEffect } from 'react';
import Footer from './components/General_Components/Footer';
import Header from './components/General_Components/Header';
import ConnectMumbai from './components/General_Components/ConnectMumbai';

/* 
  Webapp features:
    * Show MATIC Balance
    * Show balance of each token [0,1,2,3,4,5,6]
    * Provide link to opensea
    * Detect if wallet is not connected to Polygon Network
*/

function App() {

  const [networkName, setNetworkName] = useState(null)
  const [fullWallet, setFullWallet] = useState("")
  const [showWallet, setShowWallet] = useState("")
  const [balance, setBalance] = useState(0)

  /*
    1. Connect to provider 
    2. request accounts from metamask
    3. set the network name to show in the front and allow the user to see the app
    4. set the user address to show the wallet in the front
    5. slice the wallet to show the first 3 characters + last 4 characters
    6. set the user's Matic balance to show in the front using getBalance()
  */
  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const network = await provider._networkPromise
    setNetworkName(network.name)
    const signer = provider.getSigner()
    setFullWallet(await signer.getAddress())
    sliceWallet()
    const balanceUser = ethers.utils.formatEther(await signer.getBalance())
    setBalance(balanceUser.slice(0, 5))
  }

  let sliceWallet = async () => {
    let firstC = fullWallet.slice(0, 3)
    let lastC = fullWallet.slice(-4)
    setShowWallet(firstC + "..." + lastC)
  }

  useEffect(() => {
    init()
  }, [showWallet])



  return (
    <>
      {networkName != "maticmum" ? (
        <div>
          <ConnectMumbai />
          <Footer />
        </div>
      )
        :
        (<div>
          <Header showWallet={showWallet} fullWallet={fullWallet} network={networkName} balanceMatic={balance} />
          <Tabs />
          <Footer />
        </div>)
      }


    </>
  );
}

export default App;
