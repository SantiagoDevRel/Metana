import './App.css';
import { ethers } from "ethers";
import Tabs from './components/Tabs';
import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import ConnectMumbai from './components/ConnectMumbai';

/* 
  Webapp features:
    * Show MATIC Balance
    * Show balance of each token [0,1,2,3,4,5,6]
    * Provide link to opensea
    * Detect if wallet is not connected to Polygon Network
*/

function App() {

  const [networkName, setNetworkName] = useState(null)
  const [addressSigner, setAddressSigner] = useState("")

  /*   async function requestAccount() {
      const addressSigner = await window.ethereum.request({ method: 'eth_requestAccounts' }) //call current address connected
      setAddressSigner(addressSigner) //set address of the wallet that is currently connected
    } */

  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider._networkPromise
    setNetworkName(network.name)
  }

  useEffect(() => {
    init()
  }, [])

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
          <Header />
          <Tabs />
          <Footer />
        </div>)
      }


    </>
  );
}

export default App;
