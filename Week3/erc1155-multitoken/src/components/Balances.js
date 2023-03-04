import React, { useEffect } from "react";
import styles from "./Balances.module.css";

function Balances({
  balanceToken0,
  balanceToken1,
  balanceToken2,
  balanceToken3,
  balanceToken4,
  balanceToken5,
  balanceToken6,
}) {
  return (
    <div className={styles.main}>
      <div>
        <span className={styles.titles}> Balance of Token 0: </span>{" "}
        <span className={styles.balances}> {balanceToken0}</span>
      </div>

      <div>
        <span className={styles.titles}> Balance of Token 1: </span>{" "}
        <span className={styles.balances}> {balanceToken1}</span>
      </div>

      <div>
        <span className={styles.titles}> Balance of Token 2: </span>{" "}
        <span className={styles.balances}> {balanceToken2}</span>
      </div>

      <div>
        <span className={styles.titles}> Balance of Token 3: </span>{" "}
        <span className={styles.balances}> {balanceToken3}</span>
      </div>

      <div>
        <span className={styles.titles}> Balance of Token 4: </span>{" "}
        <span className={styles.balances}> {balanceToken4}</span>
      </div>

      <div>
        <span className={styles.titles}> Balance of Token 5: </span>{" "}
        <span className={styles.balances}> {balanceToken5}</span>
      </div>

      <div>
        <span className={styles.titles}> Balance of Token 6: </span>{" "}
        <span className={styles.balances}> {balanceToken6}</span>
      </div>

      <>
        <button
          className={styles.buttonRefresh}
          onClick={() => window.location.reload()}
        >
          Refresh your balance
        </button>
      </>
    </div>
  );
}

export default Balances;
