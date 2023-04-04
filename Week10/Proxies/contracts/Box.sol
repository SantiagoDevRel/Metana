// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
contract Box is Initializable {
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    address public immutable deployer;
    
    uint256 private value;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(){
        deployer = msg.sender;
    }


    function initialize (uint256 _newValue) external initializer() {
        value = _newValue;
    }

    function store(uint256 _newValue) public{
        value = _newValue;
    }

    function getValue() external view returns(uint256){
        return value; 
    }

}
