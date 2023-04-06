// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

contract Factory {
    event Deployed(address _addr);

    //CREATE2 will not revert as long as there is not 
    //an existing contract in the same address
    function deploy(uint256 _salt, bytes calldata _bytecode) public{
        bytes memory _initBytecode = _bytecode; 
        address _newAddr;
        assembly{
            let encoded_data := add(0x20, _initBytecode) //load initial code
            let encoded_size := mload(_initBytecode) //load init code's length
            _newAddr := create2(0,encoded_data, encoded_size, _salt)
        }
        emit Deployed(_newAddr);
    }

    function knowTheAddressInAdvance(uint256 _salt, bytes calldata _bytecode) public view returns(address){
        address _deployerAddress = address(this);
        bytes32 _hashBytecode = keccak256(abi.encodePacked(_bytecode));
        bytes1 _initBit = bytes1(0xff);
        //address = "0x" + first 20bytes of the keccak
        //return keccak256(abi.encodePacked(_initBit, _deployerAddress, _salt, _hashBytecode)); 
        //parse the bytes32 keccak to an address-->
        return address(uint160(uint256(keccak256(abi.encodePacked(_initBit, _deployerAddress, _salt, _hashBytecode)))));
    }
}

contract Test{
    uint256 private _number = 7;

    function setNumber(uint256 number_) public{
        _number = number_;
    }

    function getNumber() public view returns(uint256){
        return _number;
    }
}

