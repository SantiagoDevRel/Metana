// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract MultiSigWallet {
   
    //~~~~~~~ Events ~~~~~~~
    event Deposit (address indexed sender, uint256 amount);
    event Submit (uint256 indexed transactionID);
    event Approve (address indexed owner, uint256 indexed transactionID);
    event Revoke (address indexed owner, uint256 indexed transactionID);
    event Execute (uint256 indexed transactionID);
    event MinimumSignaturesUpdated(uint256 oldSignsRequired, uint256 newSignsRequired);

    //~~~~~~~ State variables ~~~~~~~
    uint256 private s_requiredSignatures;
    mapping(address => bool) private s_isOwner;
    mapping(uint256 => mapping(address => bool)) private s_isApprovedByOwner;
    address[] private s_owners;
    Transaction[] private s_transactions;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
    }

    constructor(address[] memory _owners, uint256 _requiredSigns){
        require(_owners.length > 1, "MultiSig: >1 owner required");
        s_owners = _owners;
        s_requiredSignatures = _requiredSigns;

    }

    modifier onlyOwners(){
        _;
    }

    //~~~~~~~ OnlyOwners functions ~~~~~~~
    function setSignaturesRequired(uint256 newSignaturesRequired) external onlyOwners {
        uint256 oldSignsRequired = s_requiredSignatures;
        s_requiredSignatures = newSignaturesRequired;
        emit MinimumSignaturesUpdated(oldSignsRequired, newSignaturesRequired);
    }


    //~~~~~~~ View/Pure functions ~~~~~~~
   
}
