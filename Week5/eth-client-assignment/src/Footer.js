import React from "react";
import { SiGithub } from "react-icons/si";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <div className={styles.container}>
      <footer>
        <a
          className={styles.footer}
          href="https://github.com/santiagotrujilloz"
        >
          <SiGithub /> Santiago Trujillo Zuluaga <SiGithub />{" "}
        </a>
      </footer>
    </div>
  );
}

export default Footer;
