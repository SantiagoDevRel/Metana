// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AdvancedNFT is ERC721, Ownable, ReentrancyGuard {

    //~~~~~~~ Libraries ~~~~~~~
    //Import the BitMap library and point it to the data type BitMaps.BitMap struct
    using BitMaps for BitMaps.BitMap;

    //~~~~~~~ Events ~~~~~~~
    event RevealedRandomTokenId(uint256 _randomNumber, address _owner);

    //~~~~~~~ Structs ~~~~~~~
    struct Commit{
        bytes32 commitedHash;
        uint256 blockNumber;
        uint256 tokenIdForNFT;
    }

    //~~~~~~~ Enum ~~~~~~~
    enum States{
        CLOSED,
        PRESALE,
        PUBLICSALE,
        SOLDOUT,
        CLAIM_NFT
    }

    //~~~~~~~ State variables ~~~~~~~
    uint256 constant MAX_SUPPLY = 99;
    uint256 constant PRIVATE_MINT_SUPPLY = 9;
    uint256 public s_totalSupply;
    States public s_state = States.CLOSED;
    BitMaps.BitMap private s_myBitMap;
    address[] public s_teamMembersArr;
    mapping (address => bool) s_userMinted;
    mapping (address => Commit) public s_commits;
    mapping (address => bool) public s_teamMembersMap;



    //~~~~~~~ Constructor ~~~~~~~
    constructor() ERC721("NFBIT", "NFB"){
        for(uint i=0;i<99;++i){
            s_myBitMap.set(i);
        }
        addMember(msg.sender);
    }

    //~~~~~~~ onlyAdmin/Team Functions ~~~~~~~
    
    //Activate the preSale state 
    function openPrivateSale() external onlyOwner{
        require(s_state == States.CLOSED, "NFB: Current state must be CLOSED");
        s_state = States.PRESALE;
    }

    //Activate the ClaimNFB state so the users can claim their NFT
    function activateClaim() external onlyOwner{
        require(s_state == States.SOLDOUT, "NFB: Current state must be SOLDOUT");
        s_state = States.CLAIM_NFT;
    }

    //Add a team member
    function addMember(address _member) external onlyOwner{
        s_teamMembersMap[_member] = true;
        s_teamMembersArr.push(_member);
    }

    //Function for the team to withdraw funds equally
    function withdrawFunds() external nonReentrant {
        require(s_teamMembersMap[msg.sender], "NFB: You are not a team member");
        address[] memory _teamMembers = s_teamMembersArr;
        uint256 _amount = address(this).balance / _teamMembers.length;
        for(uint i=0;i<_teamMembers.length;){
            (bool success, ) = payable(_teamMembers[i]).call{value: _amount}("");
            require(success, "NFB: Failed transfering funds to the team");
            unchecked{
                ++i;
            }
        }
    }




    //~~~~~~~ External / Public Functions ~~~~~~~

    //1st step of minting/buying --> setYourCommit() user will set the commit putting a number and a salt
    function setYourCommit(bytes32 _yourHash) external {
        Commit memory _commit;
        _commit.commitedHash = _yourHash;
        _commit.blockNumber = block.number;
        s_commits[msg.sender] = _commit;
    }

    //2nd step of minting/buying --> getYourTokenId() by verifying your commit
    function getYourTokenId(uint _tokenId, uint _salt) internal {
        Commit memory _commit = s_commits[msg.sender];
        require(_commit.tokenIdForNFT == 0,"NFB: Random token ID was already revealed");
        require(block.number < _commit.blockNumber + 255, "NFB: Too late, please submit your commit again");
        require(block.number > _commit.blockNumber + 10, "NFB: Please verify after 10 blocks.");
        require(getYourHash(_tokenId,_salt) == _commit.commitedHash , "NFB: Wrong hash");
        bytes32 commitedBlockHash = blockhash(_commit.blockNumber);
        uint256 MAX_RANDOM_NUMBER_FOR_TOKEN_ID = 1000000000000;
        bytes32 randomHash = bytes32(keccak256(abi.encodePacked(commitedBlockHash,_commit.commitedHash)));
        uint256 randomNumber = uint256(randomHash)%MAX_RANDOM_NUMBER_FOR_TOKEN_ID;
        s_commits[msg.sender].tokenIdForNFT = randomNumber;  
        emit RevealedRandomTokenId(randomNumber, msg.sender);
    }

    //3rd step of minting/buying --> mint()

    //only for users registered in the private round
    function privateRoundMint() external {
        require(s_state == States.PRESALE, "NFB: Minting is not in pre sale.");
        //1. update the ticket of the address to 0
        //2. check if the address is registered
        _allocateToken();
    }

    //anyone can call this one and mint by paying 0.001
    function publicRoundMint() external payable{
        require(s_state == States.PUBLICSALE, "NFB: Minting is not in public sale.");
        require(msg.value == 0.001 ether, "NFB: Please pay 0.001 ether to mint.");
        _allocateToken();
    }

    //~~~~~~~ Internal Functions ~~~~~~~

    function _allocateToken() internal {
        uint256 _totalSupply = s_totalSupply;
        uint256 _tokenId = s_commits[msg.sender].tokenIdForNFT;
        _safeMint(msg.sender, _tokenId);
        _updateState(_totalSupply);
        s_totalSupply++;
    }

    function _updateState(uint256 _totalSupply) internal {
        //Change state to PUBLISALE, once PRIVATE_MINT_SUPPLY has been minted.
        if(_totalSupply == PRIVATE_MINT_SUPPLY){
            s_state = States.PUBLICSALE;
        
        }
        //Change state to SOLDOUT, once MAX_SUPPLY has been minted
        else if(_totalSupply == MAX_SUPPLY){
            s_state = States.SOLDOUT;
        }
    }

    //~~~~~~~ Pure / View Functions ~~~~~~~
    function getYourHash(uint256 _tokenId, uint256 _salt) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_tokenId, _salt));
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



    //~~~~~~~~~~~~~~~~~~~~~~~~~ remove ~~~~~~~~~~~~~~~~~~~~~~~~

    function getblock() external view returns(uint256){
        return block.number;
    }

    function getBlockHash() external view returns(bytes32){
        return blockhash(s_commits[msg.sender].blockNumber);
    }

}
