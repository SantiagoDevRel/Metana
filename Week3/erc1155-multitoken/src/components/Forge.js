import React from 'react'
import { forgeTokens } from '../App'
import styles from "./Forge.module.css"

function Tab2() {

    const forgeNow = async (event) => {
        event.preventDefault()
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const arrTokenIds = []
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                arrTokenIds.push(Number(checkbox.value))
            }
        })

        const quantityToMint = parseInt(event.target.quantity.value)
        const arrQuantityToMint = Array(arrTokenIds.length).fill(quantityToMint)

        forgeTokens(arrTokenIds, arrQuantityToMint)

    }

    return (
        <>
            <div className={styles.main}>
                <form className={styles.form} onSubmit={forgeNow}>
                    <label>Check the box of the tokens you want to forge (same quantity for all of them)</label>
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
                    <button type='submit' className={styles.buttonFurge}>Furge tokens</button>
                </form>
                <div className={styles.guide}>
                    <h4>Forging Guide</h4>
                    <p>• burn token 0 + burn token 1 = <b>Token 3</b></p>
                    <p>• burn token 1 + burn token 2 = <b>Token 4</b></p>
                    <p>• burn token 0 + burn token 2 = <b>Token 5</b></p>
                    <p>• burn token 0 + burn token 1 + burn token 2 = <b>Token 6</b></p>
                    <p>• burn token 3, 4, 5 or 6 = <b>Nothing</b></p>

                </div>
            </div>
        </>
    )
}

export default Tab2
