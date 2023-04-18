import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CreateWallet from "./Components/CreateWallet";
import SignMessage from "./Components/SignMessage";
import Assets from "./Components/Assets";
import Activity from "./Components/Activity";

function Home() {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Create wallet</Tab>
          <Tab>Sign message</Tab>
          <Tab>Assets</Tab>
          <Tab>Activity</Tab>
        </TabList>

        <TabPanel>
          <CreateWallet />
        </TabPanel>
        <TabPanel>
          <SignMessage />
        </TabPanel>
        <TabPanel>
          <Assets />
        </TabPanel>
        <TabPanel>
          <Activity />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Home;
