// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Events{

    event First(address caller);
    event Second();

    function firstEvent() external{
        emit First(msg.sender);
    }

    function secondEvent() external{
        emit Second();
    }


}