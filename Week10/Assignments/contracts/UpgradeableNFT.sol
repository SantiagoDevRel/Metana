// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


//~~~~~~~~ import Libraries ~~~~~~~~ 
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

//~~~~~~~~ import Contracts ~~~~~~~~
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract UpNFT is Initializable, UUPSUpgradeable, ERC721Upgradeable, OwnableUpgradeable{
    
    //~~~~~~~~ Library ~~~~~~~~ 
    using AddressUpgradeable for address;

    //~~~~~~~~ State variables ~~~~~~~~ 
    uint256 _totalSupply;
    string _stateBaseURI;

    //~~~~~~~~ Constructor "Init" ~~~~~~~~
    function init(string memory _name, string memory _symbol) external initializer(){
        __ERC721_init(_name, _symbol);
        _stateBaseURI = "ipfs://QmSzfiayDizzpydoFN9SPFgP2MaGCkS85d1JLECy14DQUn/";
    }

    //~~~~~~~~ external functions ~~~~~~~~
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner{
        require(newImplementation.isContract(), "UpERC20: New implementation is not a contract");
    }

    function updateURI(string memory _newBaseURI) external onlyOwner{
        _stateBaseURI = _newBaseURI;
    }

    function mint() external virtual {
        _totalSupply++;
        _mint(msg.sender, _totalSupply);
    }

    //~~~~~~~~ view/pure functions ~~~~~~~~
    function totalSupply() external view returns(uint256){
        return _totalSupply;
    }

    function _baseURI() internal view override returns (string memory) {
        return _stateBaseURI;
    }

}