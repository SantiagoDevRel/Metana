## Lazy Minting NFT

Contract:
Inherits from ERC721, ERC721URIStorage, Ownable, and EIP712 contracts.
Implements a mapping of trusted signers and a struct representing an NFTicket.
Allows only trusted signers to mint an NFTicket.
Verifies the signer of an NFTicket using EIP712.
Allows the owner to add or remove trusted signers.

Script:
Defines constants for the signer, domain name, version, chain ID, and contract address.
Defines a function to create an NFTicket and generate its signature using the signer and EIP712.
Defines a function to call createNFTicket and sell an NFTicket.
