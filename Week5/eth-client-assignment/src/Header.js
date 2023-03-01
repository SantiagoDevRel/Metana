import React, { useState } from "react";
import ERC20Logs from "./ERC20Logs";
import Homepage from "./Homepage";
import styles from "./Header.module.css";
import { ReactComponent as Logo } from "./Images/ethereum-eth.svg";

function Header() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className={styles.header}>
      <div className={styles.tab_menu}>
        <div>
          <Logo />
        </div>
        <button className={styles.button} onClick={() => setActiveTab("tab1")}>
          Homepage
        </button>
        <button className={styles.button} onClick={() => setActiveTab("tab2")}>
          DAI Logs
        </button>
        <button className={styles.button} onClick={() => setActiveTab("tab3")}>
          EIP1559
        </button>
        <button className={styles.button} onClick={() => setActiveTab("tab4")}>
          Ratio gasUsed/gasLimit
        </button>
        <div>
          <Logo />
        </div>
      </div>
      {activeTab === "tab1" && (
        <div>
          <Homepage />
        </div>
      )}
      {activeTab === "tab2" && (
        <div>
          <ERC20Logs />
        </div>
      )}
      {activeTab === "tab3" && <div>Content for Tab 3</div>}
      {activeTab === "tab4" && <div>Content for Tab 4</div>}
    </div>
  );
}

export default Header;
