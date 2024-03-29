// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyTokenUpgradable is Initializable, ERC20Upgradeable, OwnableUpgradeable,UUPSUpgradeable {
    //Upgradable can't have a constructor
    //constructor() ERC20("MyToken", "MTK") {}
    //Instead we will call the init() function for each inherited contract

    function initialize(string memory _name, string memory _symbol) external initializer(){
        __ERC20_init(_name, _symbol);
        __Ownable_init();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        
    }

}

contract MyTokenUpgradableV2 is MyTokenUpgradable {

    function version() external virtual pure returns(string memory){
        return "v2!";
    }
}

contract MyTokenUpgradableV3 is MyTokenUpgradableV2 {

    function version() external virtual override pure returns(string memory){
        return "v3!";
    }
}