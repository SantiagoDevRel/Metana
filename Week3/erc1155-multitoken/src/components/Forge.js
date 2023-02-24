import React from 'react'
import { forgeTokens } from '../App'
import styles from "./Forge.module.css"

function Tab2() {

    const forgeNow = async (event) => {
        event.preventDefault()
        const tokenIds = await event.target.mintingValue.value
        const quantityTokens = await event.target.mintingValue.value

        forgeTokens([1, 2, 3], [0, 0, 0])

    }

    return (
        <>
            <div className={styles.main}>
                <form className={styles.form} onSubmit={forgeNow}>
                    <p>How many tokens do you want to forge? (same quantity for all of them)</p>
                    <div>
                        <input type="checkbox" name="token0" value="0" /> Token 0
                    </div>

                    <div>
                        <input type="checkbox" name="token1" value="1" /> Token 1

                    </div>
                    <div>
                        <input type="checkbox" name="token2" value="2" /> Token 2
                    </div>

                    <div>
                        <input type="checkbox" name="token3" value="3" /> Token 3
                    </div>

                    <div>
                        <input type="checkbox" name="token4" value="4" /> Token 4
                    </div>
                    <div>
                        <input type="checkbox" name="token5" value="5" /> Token 5
                    </div>
                    <div>
                        <input type="checkbox" name="token6" value="6" /> Token 6
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input className={styles.input} type="number" name="quantity" min={1} defaultValue={1} />
                    </div>
                    <button className={styles.buttonFurge}>Furge tokens</button>
                </form>
                <div>
                    <h2>right</h2>
                </div>
            </div>
        </>
    )
}

export default Tab2
