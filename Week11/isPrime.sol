// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Prime{


    function isPrimeYul(uint256 x) external pure returns(bool){
        bool isPrime = true;

        assembly{
            let halfX := add(div(x,2),1)
            for {let i:=2} lt(i,halfX) {i := add(i,1)}{
                if iszero(mod(x,i)){
                    isPrime := false
                    break
                }
            }
        }
        return isPrime;

    }

    function isPrimeSolidity(uint256 x) external pure returns(bool){
        bool isPrime = true;
        uint256 halfX = (x/2)+1;

        for(uint256 i = 2; i<halfX ; ++i){
            if(x%i == 0){
                isPrime = false;
                break;
            }
        }
        return isPrime;
    }
}
