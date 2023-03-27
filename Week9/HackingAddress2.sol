// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Address.sol";

contract Testing2{
    using Address for address;

    function bestPractice() external view returns(bool) {
        //will return true if the caller is an EOA
        require(msg.sender == tx.origin, "Test: You are a smart contract");
        return true;
    }
}


//when deploying this Hacking2, the transaction will revert
//because in the line 12, it won't pass the require() 
//and will revert the deployment

contract Hacking2{

    Testing2 public target;

    bool public result = false;

    constructor(Testing2 _target){
        target = _target;
        result = target.bestPractice();
    }

   

}