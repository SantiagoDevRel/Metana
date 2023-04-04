// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract BoxV2 {
    
    uint256 private value;

    function store(uint256 _newValue) public{
        value = _newValue;
    }

    function getValue() external view returns(uint256){
        return value; 
    }

    function increment() external {
        value++;
    }

}
