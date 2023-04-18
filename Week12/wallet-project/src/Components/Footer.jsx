import React from "react";
import styles from "./Footer.module.css";
function Footer() {
  return (
    <div className={styles.footer}>
      <div>Nonce: </div>
      <div>Current account: </div>
      <div>Current network: </div>
    </div>
  );
}

export default Footer;
