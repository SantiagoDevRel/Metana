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
        require(_requiredSigns > 0  && _requiredSigns <= _owners.length);
        s_owners = _owners;
        s_requiredSignatures = _requiredSigns;

        for(uint256 i=0;i<_owners.length;){
            address owner = _owners[i];
            require(owner != address(0), "Invalid address");
            require(!s_isOwner[owner], "Owner is already on the list");
            s_isOwner[owner] = true;
            s_owners.push(owner);
            unchecked {
                ++i;
            }
        }
    }

    modifier onlyOwners(){
        require(s_isOwner[msg.sender],"MultiSig: Caller must be an owner");
        _;
    }

    //~~~~~~~ OnlyOwners functions ~~~~~~~
    function setSignaturesRequired(uint256 newSignaturesRequired) external onlyOwners {
        uint256 oldSignsRequired = s_requiredSignatures;
        s_requiredSignatures = newSignaturesRequired;
        emit MinimumSignaturesUpdated(oldSignsRequired, newSignaturesRequired);
    }

    function submitNewTx(address _to, uint256 _value, bytes calldata _data) external onlyOwners{
        Transaction memory newTx = Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false
        });
        uint256 txID = s_transactions.length;
        s_transactions.push(newTx);
        emit Submit(txID);
    }

    function approveTx(uint256 _txID) external onlyOwners {
        require(_txExistsAndNoExecuted(_txID));
        address _sender = msg.sender;
        require(!s_isApprovedByOwner[_txID][_sender], "MultiSig: You already approved this Tx");
        s_isApprovedByOwner[_txID][_sender] = true;
        emit Approve(_sender, _txID);
    }
    
    function executeTx(uint256 _txID) external onlyOwners{
        require(_txExistsAndNoExecuted(_txID));
        require(_getApprovalCount(_txID) >= s_requiredSignatures, "MultiSig: Not enough approvals yet");
        s_transactions[_txID].executed = true;
        Transaction memory _transaction = s_transactions[_txID];
        uint256 _value = _transaction.value;
        address _to = _transaction.to;     
        bytes memory _data = _transaction.data;  
        (bool success, ) = (_to).call{value: _value}(_data);
        require(success);
    }

    

    //~~~~~~~ Internal function ~~~~~~~
    function _txExistsAndNoExecuted(uint256 _txID) internal view returns(bool){
        require(_txID < s_transactions.length, "MultiSig: Transaction doesn't exist");
        require(!s_transactions[_txID].executed, "MultiSig: Transaction already executed");
        return true;
    }

    function _getApprovalCount(uint256 _txID) internal view returns(uint256){
        uint256 approvals;
        address[] memory _owners = s_owners;
        uint256 ownersLength = _owners.length;
        for(uint256 i=0;i<ownersLength;){
            if(s_isApprovedByOwner[_txID][_owners[i]]){
                approvals+= 1;
            }
            unchecked{++i;}
        }
        return approvals;
    }

    //~~~~~~~ View/Pure functions ~~~~~~~
    function isOwner(address user) external view returns(bool){
        return s_isOwner[user];
    }

    

    function getOwner(uint256 index) external view returns(address){
        return s_owners[index];
    }

    function signaturesRequired() external view returns(uint256){
        return s_requiredSignatures;
    }

    function getTransactionAtIndex(uint256 index) external view returns(Transaction memory){
        return s_transactions[index];
    }

    function TxIsApprovedByOwner(uint256 txID, address owner) external view returns(bool){
        return s_isApprovedByOwner[txID][owner];
    }

    //~~~~~~~ Receive function ~~~~~~~
    receive() external payable{
        emit Deposit(msg.sender, msg.value);
    }
}
