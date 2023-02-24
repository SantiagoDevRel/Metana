import React, { useState } from 'react'
import { mintBatch } from '../App'
import styles from "./Mint.module.css"

function Tab1() {
    const [wait, setWait] = useState(false)

    const mintNow = async (event) => {
        event.preventDefault()
        const quantityTokens = Number(event.target.mintingValue.value)
        mintBatch([quantityTokens, quantityTokens, quantityTokens])
        setWait(true)
    }

    return (
        <>
            <form className={styles.form} onSubmit={mintNow}>
                <label>How many tokens do you want to mint?</label>
                <input className={styles.input} type="number" name="mintingValue" min={1} defaultValue={1} />
                <button className={styles.buttonMint}>Mint Tokens 0,1 & 2</button>
                {wait === true ? <span>Please wait 1 minute to mint again.</span> : ("")}

            </form>
        </>
    )
}

export default Tab1
