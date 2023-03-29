// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/*
    ~ This contract is made to replace the mapping (address=>uint256) amountMintedByUser;
    ~ changing that mapping from amountMintedByuser[msg.sender] ++ will cost around 40k units of gas
    ~ changing the claimTicketOrBlockTransaction(ticketNumber) by an user, will cost around 26k of gas
    ~ this is a more efficient way of using the bits to store binary data like if an user minted a ticket or not yet.
    ~ everytime an user mints a ticket, the bit will be set from 1 to 0 which is cheaper than setting zero to non-zero 
*/

contract PresaleBenchmark {

    //1. we set all the 256 bits to 1111 1111 1111 ....
    uint256 private constant MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    
    //2. we create an s_array of uint256 with 3 slots = (each slot contains uin256 sets to 1)
    //we have in total 256 * 3 tickets = 768
    //s_arr[0] contains tickets from 0-255
    //s_arr[1] contains tickets from 256-511
    //s_arr[2] contains tickets from 512-767
    uint256[3] s_arr = [MAX_INT, MAX_INT, MAX_INT];

    function claimTicketOrBlockTransaction(uint256 ticketNumber) external {
        //ticketNumber should be within 0-767
        require(ticketNumber < s_arr.length * 256, "too large");

        //we get the location of the ticket in the s_arr[0, 1 or 2]
        uint256 storageOffset = ticketNumber / 256;

        //we get the location of the ticket within the 256bytes[0-255]
        uint256 offsetWithin256 = ticketNumber % 256;

        //optimize the reading from storage:
        uint256 copy_array = s_arr[storageOffset];

        //this line gets the bit stored of the ticketNumber within the 256bits
        uint256 storedBit = (copy_array >> offsetWithin256) & uint256(1);
        
        //this will check that the storedBit is equal to 1, so that is not used yet.
        require(storedBit == 1, "already taken");

        //this will set the bit of the ticketNumber to 0
        s_arr[storageOffset] = copy_array & ~(uint256(1) << offsetWithin256);
    }
}