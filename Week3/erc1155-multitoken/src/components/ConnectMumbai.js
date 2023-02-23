import React from 'react'
import styles from "./ConnectMumbai.module.css"


function ConnectMumbai() {

    const connectMetamaskMain = async () => {
        await changeToMumbai();
        document.location.reload(true)
    };

    const changeToMumbai = async () => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found")
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: `0x13881`,
                        chainName: "Mumbai Testnet",
                        nativeCurrency: {
                            name: "MATIC",
                            symbol: "MATIC",
                            decimals: 18
                        },
                        rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                        blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"]
                    }
                ]

            })
        } catch (err) {
            console.log(err, "ERROR CONNECTING TO MUMBAI");
        }
    };

    return (
        <>
            <div className={styles.container}>
                <button onClick={() => connectMetamaskMain("polygon")} className={styles.buttonc}>Switch to Polygon Mumbai Network</button>
            </div>
        </>
    )
}

export default ConnectMumbai
