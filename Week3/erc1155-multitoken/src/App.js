import './App.css';
import { ethers } from "ethers";
import Tabs from './components/Tabs';
import { useState, useEffect } from 'react';
import Footer from './components/General_Components/Footer';
import Header from './components/General_Components/Header';
import ConnectMumbai from './components/General_Components/ConnectMumbai';
import ForgingABI from "./artifacts/contracts/Forging.sol/Forging.json"
import MultiTokenABI from "./artifacts/contracts/MultiToken.sol/MultiToken.json"
import { formatEther } from 'ethers/lib/utils';
const ForgingAddress = "0xFfb1F858c947e5120c3e2855d73d95B341809d58"
const MultiTokenAddress = "0x8EDF94B03e15171bab5C6DBDa4Efb1C57263Ed96"
let contractMultiToken = {}, contractForging = {}, signer = {}, provider = {};


/* 
  Webapp features:
    * Show MATIC Balance
    * Show balance of each token [0,1,2,3,4,5,6]
    * Provide link to opensea
    * Detect if wallet is not connected to Polygon Network
*/

export async function mintBatch([t1, t2, t3]) {

  try {
    await contractForging.mintBachToken([0, 1, 2], [t1, t2, t3])
  }
  catch {
    console.log("Please try again in 1 minute")
  }
}

export async function forgeTokens(tokenIds, amounts) {

  try {
    await contractForging.forgeTokens(tokenIds, amounts)
  }
  catch (err) {
    console.log("Error forging", err)
  }

}

export async function tradeTokens(tokenGive, amount, tokenReceive) {

  try {
    await contractForging.tradeTokens(tokenGive, amount, tokenReceive)
  }
  catch (err) {
    console.log(err)
  }

}


export default function App() {

  const [networkName, setNetworkName] = useState(null)
  const [fullWallet, setFullWallet] = useState("0x8EDF94B03e15171bab5C6DBDa4Efb1C57263Ed96") //set Forging adddress by default to avoid console errors
  const [showWallet, setShowWallet] = useState("")
  const [balance, setBalance] = useState(0)
  const [balanceToken0, setBalanceToken0] = useState(0)
  const [balanceToken1, setBalanceToken1] = useState(0)
  const [balanceToken2, setBalanceToken2] = useState(0)
  const [balanceToken3, setBalanceToken3] = useState(0)
  const [balanceToken4, setBalanceToken4] = useState(0)
  const [balanceToken5, setBalanceToken5] = useState(0)
  const [balanceToken6, setBalanceToken6] = useState(0)




  /*
    1. Connect to provider 
    2. request accounts from metamask
    3. set the network name to show in the front and allow the user to see the app
    4. set the user address to show the wallet in the front
    5. slice the wallet to show the first 3 characters + last 4 characters
    6. set the user's Matic balance to show in the front using getBalance()
  */
  const init = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const network = await provider._networkPromise
    setNetworkName(network.name)
    signer = provider.getSigner()
    setFullWallet(await signer.getAddress())
    await sliceWallet()
    const balanceUser = ethers.utils.formatEther(await signer.getBalance())
    setBalance(balanceUser.slice(0, 5))
    contractMultiToken = new ethers.Contract(MultiTokenAddress, MultiTokenABI.abi, provider);
    await getBalanceBatch()
    contractForging = new ethers.Contract(ForgingAddress, ForgingABI.abi, signer);
  }

  let sliceWallet = async () => {
    let firstC = fullWallet.slice(0, 3)
    let lastC = fullWallet.slice(-4)
    setShowWallet(firstC + "..." + lastC)
  }

  useEffect(() => {
    init()
  }, [showWallet])


  const getBalanceBatch = async () => {
    const balances = await contractMultiToken.balanceOfBatch([fullWallet, fullWallet, fullWallet, fullWallet, fullWallet, fullWallet, fullWallet], [0, 1, 2, 3, 4, 5, 6])
    const mapBalances = balances.map(balance => parseInt(balance._hex)) //Maybe formatEther?
    setBalanceToken0(mapBalances[0])
    setBalanceToken1(mapBalances[1])
    setBalanceToken2(mapBalances[2])
    setBalanceToken3(mapBalances[3])
    setBalanceToken4(mapBalances[4])
    setBalanceToken5(mapBalances[5])
    setBalanceToken6(mapBalances[6])
  }




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
          <Tabs token0={balanceToken0} token1={balanceToken1} token2={balanceToken2} token3={balanceToken3} token4={balanceToken4} token5={balanceToken5} token6={balanceToken6}
          />
          <Footer />
        </div>)
      }


    </>
  );
}


