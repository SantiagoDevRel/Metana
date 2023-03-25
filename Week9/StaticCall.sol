// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract TestingAbi {
    /*
        * Create 4 different functions that returns a uint and the block.timestamp
        * 2 of them are copies of the first 2.
    */

    function func1() external view returns (uint256, uint256) {
        return (1, block.timestamp);
    }

    function func1_copy() external view returns (uint256, uint256) {
        return (1, block.timestamp);
    }

    function func2() external view returns (uint256, uint256) {
        return (2, block.timestamp);
    }

    function func2_copy() external view returns (uint256, uint256) {
        return (2, block.timestamp);
    }

    /*
        * Created 4 functions to return the function signature
        * of the above 4 functions, using abiEncodeWithSignature()
    */

    function getData1() external pure returns (bytes memory) {
        return abi.encodeWithSignature("func1()");
    }

    function getData_copy1() external pure returns (bytes memory) {
        return abi.encodeWithSignature("func1_copy()");
    }

    function getData2() external pure returns (bytes memory) {
        return abi.encodeWithSignature("func2()");
    }

    function getData_copy2() external pure returns (bytes memory) {
        return abi.encodeWithSignature("func2_copy()");
    }
}



contract StaticCall{

    /*
        * Created a function that receives:
        * 1. the array targets with the address of the contracts to call 
            (in this case is x4 times the same address of TestingAbi contract
        * 2. the fnSignatures are the function signatures of the contract that we will call
            in this case abi.encodedWithSignature --> "func1()", "func1_copy", "func2()" and "func2_copy()" 
        * 3. create the memory "results" array to store the results when we call each function
        * 4. make an staticcall to each function, the result will be store in the bytes memory data
        * 5. store that "data" into the results[i] array
        * 6. iterate through all the function signatures and _targets
        * 7. return the array "results" with all the results (all of them return the SAME timestamp)
            because using staticcall is calling everything at the same time.
        
    */
    function call(address[] memory _targets, bytes[] memory fnSignatures) external view returns(bytes[] memory){
        require(_targets.length == fnSignatures.length, "!= lengths");
        bytes[] memory results = new bytes[](_targets.length);
        for(uint i=0;i<_targets.length;++i){

            (bool success, bytes memory data) = _targets[i].staticcall(fnSignatures[i]);
            require(success);
            results[i] = data;
        }

        return results;

    }

}

/*
    the first 32 bytes are the number 1 or number 2 (depending on the function that is calling)
    the second 32 bytes are the blocktimestamp (in ALL the cases is the SAME block.timestamp)
    results[] ==>
    0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000641eb70e,
    0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000641eb70e,
    0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000641eb70e,
    0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000641eb70e

*/