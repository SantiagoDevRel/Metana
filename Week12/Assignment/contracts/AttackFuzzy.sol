pragma solidity ^0.4.21;

interface IName {
    function name() external view returns (bytes32);
}

contract Attack is IName{

    function name() external view returns (bytes32){
        return bytes32("smarx");
    }
}