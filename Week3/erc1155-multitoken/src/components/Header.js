import React from 'react'
import styles from "./Header.module.css"

function Header() {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>Metana Dapp ERC1155 Minter</h1>
            <button className={styles.buttonc}>Balance</button>
            <button className={styles.buttonc}>Disconnect</button>

        </div>
    )
}

export default Header
