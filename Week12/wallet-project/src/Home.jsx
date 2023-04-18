import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MainWallet from "./Components/MainWallet";
import Assets from "./Components/Assets";
import Activity from "./Components/Activity";
import { useState } from "react";
import Footer from "./Components/Footer";

function Home() {
  const [account, setAccount] = useState({});
  /**
   * This fucntion is to get the wallet instance from the child CreateWallet
   */
  const handleWallet = (wallet) => {
    console.log("Received data from child:", wallet);
    setAccount(wallet);
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
      <Footer mainWallet={account} />
    </div>
  );
}

export default Home;
