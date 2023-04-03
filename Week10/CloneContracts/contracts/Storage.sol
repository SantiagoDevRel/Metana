// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Clones.sol";

//"function clone(address implementation) internal returns (address instance)"

/*
    -The library Clones.sol will create a new clone from the address that is passed as a parameter
    -it will return the instance of the clone
    -this clone is created from address(0) so the "msg.sender" in a constructor will be address(0)

 */
contract StorageFactory {
    using Clones for address;
    uint private number;
    address private owner;

    function createClone(address _newClone) external returns(address){
        address instance = _newClone.clone();
        return instance;
    }
}
