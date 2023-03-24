// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/*
    ~ This contract is made to replace the mapping (address=>uint256) amountMintedByUser;
    ~ changing that mapping from amountMintedByuser[msg.sender] ++ will cost around 40k units of gas
    ~ changing the claimTicketOrBlockTransaction(ticketNumber) by an user, will cost around 26k of gas
    ~ this is a more efficient way of using the bits to store binary data like if an user minted a ticket or not yet.
*/

contract PresaleBenchmark {

    //1. we set all the 256 bits to 1111 1111 1111 ....
    uint256 private constant MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    
    //2. we create an array of uint256 with 3 slots = (each slot contains uin256 sets to 1)
    //we have in total 256 * 3 tickets = 768
    //arr[0] contains tickets from 0-255
    //arr[1] contains tickets from 256-511
    //arr[2] contains tickets from 512-767
    uint256[3] arr = [MAX_INT, MAX_INT, MAX_INT];

    function claimTicketOrBlockTransaction(uint256 ticketNumber) external {
        //ticketNumber should be within 0-767
        require(ticketNumber < arr.length * 256, "too large");

        //we get the location of the ticket in the arr[0, 1 or 2]
        uint256 storageOffset = ticketNumber / 256;

        //we get the location of the ticket within the 256bytes[0-255]
        uint256 offsetWithin256 = ticketNumber % 256;

        //this line gets the bit stored of the ticketNumber within the 256bits
        uint256 storedBit = (arr[storageOffset] >> offsetWithin256) & uint256(1);
        
        //this will check that the storedBit is equal to 1, so that is not used yet.
        require(storedBit == 1, "already taken");

        //this will set the bit of the ticketNumber to 0
        arr[storageOffset] = arr[storageOffset] & ~(uint256(1) << offsetWithin256);
    }
}