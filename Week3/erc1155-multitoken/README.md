# ♾️ METANA WEEK 3 ♾️

Assignment:
You must have a total of 7 tokens within the collection id [0-6]
There is no supply limit for each token
Anyone can mint tokens [0-2], but there is a 1-minute cooldown between mints. These are free to mint except for the gas cost.
Token 3 can be minted by burning token 0 and 1.
Token 4 can be minted by burning token 1 and 2
Token 5 can be minted by burning 0 and 2
Token 6 can be minted by burning 0, 1, and 2
Tokens [4-6] cannot be forged into other tokens
Tokens [4-6] can be burned but you get nothing back
You can trade any token for [0-2] by hitting the trade this button.
The process of burning and minting is called forging in this context.
The webapp must tell the user how much matic they have (we will use the polygon network for cost savings)
The webapp must tell the user how much of each token they have
Provide a link to the OpenSea page somewhere
Important if the website detects someone is not on the polygon network, it must prompt them to change and autofill the feeds for changing the network (lesson on this later)
Important please use some styling on this website to make it look nice (bootstrap, tailwind CSS, etc). This is something you can show to future employers or business partners.
You must use 2 separate contracts. One for the ERC1155 token, and one for the forging logic. The forging logic will need mint privileges.
Warning: Start on this assignment early. The solidity code is easy to write, but the frontend integration and workflows will have a lot of unfamiliar problems we will not explicitly teach you about. It is inevitable that you will encounter them in this assignment, so start early!

# Contract MultiToken (ERC1155)

`0x5c9A48D03849Ae5492981dFC24250cd762417622`
`https://mumbai.polygonscan.com/address/0x5c9A48D03849Ae5492981dFC24250cd762417622#code`

# Contract Forging

`0x484756547Abf68053d9f7cD89d9f00d940Aa162A`
`https://mumbai.polygonscan.com/address/0x484756547Abf68053d9f7cD89d9f00d940Aa162A#code`

# Dapp deployed to

`https://super-shadow-2050.on.fleek.co/`

# Hardhat Coverage

![Hardhat_Coveragge](https://github.com/strujilloz/Metana/blob/main/Week3/erc1155-multitoken/src/components/images/hardhat_coverage.png)
