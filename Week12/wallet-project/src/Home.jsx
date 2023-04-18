import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MainWallet from "./Components/MainWallet";
import Assets from "./Components/Assets";
import Activity from "./Components/Activity";
import { useState } from "react";
import Footer from "./Components/Footer";

function Home() {
  const [account, setAccount] = useState({});
  const [currentNonce, setCurrentNonce] = useState("0x");
  const [currentAddress, setCurrentAddress] = useState("0x");
  /**
   * This fucntion is to get the wallet instance from the child CreateWallet
   */
  const handleWallet = (wallet) => {
    console.log("Received data from child:", wallet);
    setAccount(wallet);
    const { currentAddress, currentNonce } = wallet;
    setCurrentAddress(currentAddress);
    setCurrentNonce(currentNonce);
  };

  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Create wallet</Tab>
          <Tab>Assets</Tab>
          <Tab>Activity</Tab>
        </TabList>

        <TabPanel>
          <MainWallet mainWallet={handleWallet} />
        </TabPanel>
        <TabPanel>
          <Assets mainWallet={account} />
        </TabPanel>
        <TabPanel>
          <Activity mainWallet={account} />
        </TabPanel>
      </Tabs>

      <Footer nonce={currentNonce ? currentNonce : 0} address={currentAddress ? currentAddress : 0} />
    </div>
  );
}

export default Home;
