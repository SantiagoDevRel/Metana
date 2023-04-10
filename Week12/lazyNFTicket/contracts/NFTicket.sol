// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract LazyNFT is ERC721, ERC721URIStorage, Ownable, EIP712 {
    // ~~~~~~ Libraries ~~~~~~
    using ECDSA for address;

    // ~~~~~~ Constants ~~~~~~
    string private constant DOMAIN_NAME = "Vouchers-Santiago";
    string private constant VERSION = "1";

    // ~~~~~~ State variables ~~~~~~
    mapping (address => bool) private s_isTrustedSigner;

    struct NFTicket {
        uint256 tokenId;
        address buyer;
        uint256 price;
        string uri;
        bytes signature;
    }

    // ~~~~~~ Constructor ~~~~~~
    constructor() ERC721("NFTicket", "NFTI") EIP712(DOMAIN_NAME, VERSION) {
        s_isTrustedSigner[msg.sender] = true;
    }

    // ~~~~~~ Public/Ext Functions ~~~~~~
    function mintByUser(NFTicket calldata ticket) public payable {
        address signer = _verifySigner(ticket);
        require(s_isTrustedSigner[signer], "LazyNFT: Wrong signer");
        require(msg.value >= ticket.price, "LazyNFT: Not enough ether sent");
        _safeMint(ticket.buyer, ticket.tokenId);
        _setTokenURI(ticket.tokenId, ticket.uri);
    }

    function addTrustedSigner(address newSigner) external onlyOwner{
        s_isTrustedSigner[newSigner] = true;
    }

    function removeTrustedSigner(address newSigner) external onlyOwner{
        s_isTrustedSigner[newSigner] = false;
    }

    
    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {

        return super.tokenURI(tokenId);
    }
}
