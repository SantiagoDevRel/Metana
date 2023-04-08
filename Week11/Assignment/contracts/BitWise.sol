//In the following code, re-implement countBitSetAsm() with inline assembly.

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract BitWise {

    // count the number of bit set in data.  i.e. data = 7, result = 3

    function countBitSet(uint8 data) public pure returns (uint8 result) {

        for( uint i = 0; i < 8; i += 1) {

            if( ((data >> i) & 1) == 1) {

                result += 1;

            }

        }

    }

    function countBitSetAsm(uint8 data ) public pure returns (uint8 result) {
        //1. declare the for to iterate 8 times
        //2. use the (shr == >>) operator to shift the bits from data to "i" positions
        //3. after the shr, perform the (and == &) operator with 1
        //4. if result is true, result+=1 so add 1 to result.
        assembly{
            //   initializer    condition    post-iteration
            for   {let i:= 0}    lt(i,8)     {i:=add(i,1)}{ //1
                if and(shr(data,i),1){ //2,3
                    result := add(result,1)//4
                }
            } 
        }

        result = countBitSet(data);

    }

}