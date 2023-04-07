// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//~~~~~~~~ import Libraries ~~~~~~~~ 
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

//~~~~~~~~ import Contracts ~~~~~~~~
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract UpERC20 is Initializable, UUPSUpgradeable, ERC20Upgradeable, OwnableUpgradeable  {

    //~~~~~~~~ Libraries ~~~~~~~~ 
    using AddressUpgradeable for address;

    //~~~~~~~~ Events ~~~~~~~~ 
    event NewMinterAddress(address newMinter);


    //~~~~~~~~ State variables ~~~~~~~~ 
    //Implementations MUST preserve this layout of state variables
    //The best could be to inherit and override the functions
    mapping(address => bool) private isMinter;

    //~~~~~~~~ Constructor "Init" ~~~~~~~~
    function init(string memory _name, string memory _symbol) external initializer() {
        __ERC20_init(_name, _symbol);
        __Ownable_init();
    }

    //~~~~~~~~ onlyOwner functions ~~~~~~~~
    function setMinterAddress(address _newMinter) external virtual onlyOwner {
        isMinter[_newMinter] = true;
        emit NewMinterAddress(_newMinter);
    }

    function mintByOwner(address _to, uint256 _amount) external virtual onlyOwner{
        _mint(_to, _amount);
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner{
        require(newImplementation.isContract(), "UpERC20: New implementation isn't a contract");
    }

    //~~~~~~~~ onlyMinter functions ~~~~~~~~
    function mint(address _to, uint256 _amount) external virtual {
        require(isMinter[msg.sender], "UpERC20: You are not a minter");
        _mint(_to, _amount);
    }

    //~~~~~~~~ View functions ~~~~~~~~
    function getMinter(address _minter) external virtual view returns(bool){
        return isMinter[_minter];
    }

   
}