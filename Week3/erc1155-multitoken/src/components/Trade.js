import React from "react";
import { tradeTokens } from "../App";
import styles from "./Trade.module.css";

function Trade() {
  const tradeNow = async (event) => {
    event.preventDefault();
    const tokenTrade = Number(event.target.tokenTrade.value);
    const tokenReceive = Number(event.target.tokenReceive.value);
    const quantity = Number(event.target.quantity.value);
    tradeTokens(tokenTrade, quantity, tokenReceive);
  };

  return (
    <>
      <form className={styles.form} onSubmit={tradeNow}>
        <label>Which token do you want to trade?</label>
        <input
          className={styles.input}
          type="number"
          name="tokenTrade"
          min={0}
          max={3}
          defaultValue={0}
        />

        <label>Which token do you want to receive?</label>
        <input
          className={styles.input}
          type="number"
          name="tokenReceive"
          min={0}
          max={2}
          defaultValue={0}
        />

        <label>Quantity</label>
        <input
          className={styles.input}
          type="number"
          name="quantity"
          min={1}
          defaultValue={1}
        />

        <button className={styles.buttonTrade} type="onSubmit">
          Trade Now
        </button>
      </form>
    </>
  );
}

export default Trade;
