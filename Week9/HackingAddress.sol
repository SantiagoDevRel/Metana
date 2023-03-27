// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Address.sol";

contract TestingContract{
    using Address for address;

    //1. calling isContract() from an EOA directly on TestingAddress should return False
    function isContract1() external view returns(bool){
        return msg.sender.isContract();
    }

    function isContract2_destroyed(address _contract) external view returns(bool){
        return _contract.isContract();
    }
}

contract HackingContract{

    TestingContract public target;

    bool public result = true;

    constructor(TestingContract _target){
        target = _target;
        //2. result is set to true, when it calls the isContract() should be set to false 
        //because is calling from a contract in construction
        result = target.isContract1();
    }

    //1. calling isContract() from HackingContract to TestingContract, should return true.
    function isContract1() external view returns(bool){
        return target.isContract1();
    }

    //3. BEFORE destroy: isContract(this) == true
    //  AFTER Destroy: isContract(this) == false
    function selfDestroy() external {
        address _target = address(target);
        selfdestruct(payable (_target));
    }

}