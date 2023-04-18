import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";
function Footer(props) {
  return (
    <div className={styles.footer}>
      <div>Current account: {props.address} </div>
      <div>Nonce: {props.nonce}</div>
    </div>
  );
}

export default Footer;
