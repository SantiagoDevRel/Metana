// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

//Add following test cases for String contract: 
/* 
charAt(“abcdef”, 2) should return 0x6300
charAt(“”, 0) should return 0x0000
charAt(“george”, 10) should return 0x0000 
*/
contract String {

   function charAt(string memory input, uint256 index) public pure returns(bytes2 num) {
        assembly{
            let dataLength := mload(input)
            if lt(input,index){
                num := 0
            }
            for {let i := 0} lt(i,dataLength) {i := add(i,1)}{
                if eq(i,index){
                    let _byte := mload(add(add(input, 32), i))
                    // Convert the byte to a bytes2 value by shifting it left by 8 bits
                    num := shl(8, _byte)
                    // Return the bytes2 value stored in the number variable
                    return(num, 2)
                }
            }
        }
   }

   function chartAtSolidity(string memory input, uint256 index) public pure returns(bytes2){
       bytes memory copy = bytes(input);
       for(uint256 i=0;i<copy.length;++i){
           if(i==index){
               return copy[i];
           }
       }
        return 0;
   }



}