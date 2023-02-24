import React from 'react'
import styles from "./Header.module.css"
import { ReactComponent as MaticLogo } from "../images/matic.svg"

function Header({ showWallet, fullWallet, balanceMatic, }) {

    const linkWallet = `https://mumbai.polygonscan.com/address/${fullWallet}`



    return (
        <div className={styles.header}>
            <h1 className={styles.title}>Metana Dapp ERC1155 Minter</h1>
            <button className={styles.buttonc}><svg><MaticLogo /></svg> {balanceMatic} </button>
            <a href='https://mumbai.polygonscan.com/' target="_blank"><button className={styles.buttonc}>Polygon Mumbai</button></a>
            <a href={linkWallet} target="_blank"><button className={styles.buttonc}>{showWallet}</button></a>

        </div>
    )
}

export default Header
