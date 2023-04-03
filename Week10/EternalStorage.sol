//SPDX-License-Identifier: MIT

pragma solidity 0.8.1;


/*
    * Eternal storage contract:
        -is a contract that will always contain that storage (caller and number)
        -must have a getter and setter in its contract

    * callerLib library:
        -is a library (no need to deploy) 
        -will call the get and sets functions on the eternal storage contract

    * Implementation contract
        -will use the caller library for addresses
        -all the calls to the eternal storage will be done through the library
        -ex: when we call set(_num) in the implementation, 
            this will use setCallerLib(eternalStorageContract, _num)
            and this will redirect the call to the eternal storage
        *THIS WILL NOT PRESERVE THE CONTEXT OF THE CALL*
        *this means that msg.sender will be the contract Implementation
        *and not the EOA that trigger the transactions
*/
 contract EternalStorage{

    address public caller;
    uint public number;

    function getCaller() public view returns (address){
        return caller;
    }

    function setCaller(uint256 _number) public
    {
        caller = msg.sender;
        number = _number;
    }
}

library callerLib {

    function getCallerLib(address _eternalStorage) public view returns (address)  {
        return EternalStorage(_eternalStorage).getCaller();
    }

    function setCallerLib(address _eternalStorage, uint256 _num) public {
        EternalStorage(_eternalStorage).setCaller(_num);
    }
}

contract Implementation {
    using callerLib for address;
    address eternalStorage;

    constructor(address _eternalStorage) {
        eternalStorage = _eternalStorage;
    }

    function get() public view returns(address) {
        return eternalStorage.getCallerLib();
    }

    function set(uint256 _num) public {
        eternalStorage.setCallerLib(_num);
    }
}