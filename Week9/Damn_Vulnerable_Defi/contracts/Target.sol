// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

contract Target {
   
   function hack() external pure {
    while(true){

    }
   }

   function getHackSignature() external view returns(bytes memory){
    return (abi.encodeWithSignature("hack()"));
   }
}