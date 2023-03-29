// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdvancedNFT is ERC721, Ownable {

    //Import the BitMap struct from the library
    //and point the library to the data type BitMaps.BitMap struct
    using BitMaps for BitMaps.BitMap;

    //Create Struct for the commit
    struct Commit{
        bytes32 hash;
        uint256 blockNumber;
        bool revealed;
    }

    //Create the states of this contract.
    enum States{
        CLOSED,
        PRESALE,
        PUBLICSALE,
        SOLDOUT,
        CLAIM_NFB
    }

    //State variables
    uint256 constant MAX_SUPPLY = 99;
    uint256 constant PRIVATE_MINT_SUPPLY = 9;
    uint256 public s_totalSupply;
    States public s_state = States.CLOSED;
    BitMaps.BitMap private s_myBitMap;
    mapping (address => bool) s_userMinted;
    mapping (address => Commit) public commits;



    constructor() ERC721("NFBIT", "NFB"){//3_520_659 gas with forloop 1000 - 2_723_520 with no for loop
        for(uint i=0;i<99;++i){
            s_myBitMap.set(i);
        }
    }

    function _updateState(uint256 _totalSupply) internal {
        if(_totalSupply == PRIVATE_MINT_SUPPLY){
            s_state = States.PUBLICSALE;
        }else if(_totalSupply == MAX_SUPPLY){
            s_state = States.SOLDOUT;
        }
    }

    //Activate the preSale state 
    function openPrivateSale() external onlyOwner{
        s_state = States.PRESALE;
    }

    //Activate the ClaimNFB state so the users can claim their NFT
    function activateClaim() external onlyOwner{
        s_state = States.CLAIM_NFB;
    }

    //only for users registered in the 
    function privateRound() external {
        require(s_state == States.PRESALE, "NFB: Minting is not in pre sale.");
        //1. update the ticket of the address to 0
        //2. check if the address is registered
        _allocateToken();
    }

    function publicRound() external payable{
        require(s_state == States.PUBLICSALE, "NFB: Minting is not in public sale.");
        require(msg.value == 0.001 ether, "NFB: Please pay 0.001 ether to mint.");
        _allocateToken();
    }

    function _allocateToken() internal {
        uint256 _totalSupply = s_totalSupply;
        _safeMint(msg.sender, _totalSupply);
        _updateState(_totalSupply);
        s_totalSupply++;
    }


    //Manage the datastructure bits
    function getBit(uint256 _index) external view returns(bool){
        return s_myBitMap.get(_index);
    }

    function setToBit(uint _index, bool _value) external {
        s_myBitMap.setTo(_index, _value);
    }

    function setBit(uint256 _index) external {//43971 tx cost - 22767 ex cost
        s_myBitMap.set(_index);
    }

    function unsetBit(uint256 _index) external { //30942 tx cost (from 1 to 0)
        s_myBitMap.unset(_index);
    }

    function setMapping() external {//43509 tx cost - 22445 ex cost
        s_userMinted[msg.sender] = true;
    }    
    
    function getMapping() external view returns(bool){
        return s_userMinted[msg.sender];
    }


}
