import React, { useState } from "react";
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
          Tab 2
        </button>
        <button className={styles.button} onClick={() => setActiveTab("tab3")}>
          Tab 3
        </button>
        <button className={styles.button} onClick={() => setActiveTab("tab4")}>
          Tab 4
        </button>
        <div>
          <Logo />
        </div>
      </div>
      {activeTab === "tab1" && <div>Content for Tab 1</div>}
      {activeTab === "tab2" && <div>Content for Tab 2</div>}
      {activeTab === "tab3" && <div>Content for Tab 3</div>}
      {activeTab === "tab4" && <div>Content for Tab 4</div>}
    </div>
  );
}

export default Header;
