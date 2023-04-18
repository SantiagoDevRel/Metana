import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CreateWallet from "./Components/CreateWallet";

function Home() {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Create wallet</Tab>
          <Tab>Sign message</Tab>
          <Tab>Assets</Tab>
          <Tab>Change account</Tab>
        </TabList>

        <TabPanel>
          <CreateWallet />
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 3</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 4</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Home;
