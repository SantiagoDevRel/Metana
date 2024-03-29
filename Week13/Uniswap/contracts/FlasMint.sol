//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC3156FlashLender.sol";
import "@openzeppelin/contracts/interfaces/IERC3156FlashBorrower.sol";

contract FlashMint {

    address public constant WETH10 = 0xf4BB2e28688e89fCcE3c0580D37d36A7672E8A9F;
    bytes32 public immutable CALLBACK_SUCCESS = keccak256("ERC3156FlashBorrower.onFlashLoan");
    
    address public s_initiator;
    address public s_token;
    uint256 public s_iwethTotalSupplyBeforeFlashLoan;
    uint256 public s_iwethTotalSupplyDuringFlashLoan;
    uint256 public s_balance;
    uint256 public s_fee;
    bytes public s_bytes;

    function flash() external{
        s_iwethTotalSupplyBeforeFlashLoan = IERC20(WETH10).totalSupply();

        uint256 amount = s_iwethTotalSupplyBeforeFlashLoan + 1;
        bytes memory data = abi.encode(msg.sender);

        IERC20(WETH10).approve(WETH10, amount);

        IERC3156FlashLender(WETH10).flashLoan(IERC3156FlashBorrower(address(this)), WETH10, amount, data);
    }

    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32){
        //here I should do whatever I want with the IWETH I just borrowed
        s_initiator = initiator;
        s_iwethTotalSupplyDuringFlashLoan = IERC20(WETH10).totalSupply();
        s_token = token;
        s_balance = amount;
        s_fee = fee;
        s_bytes = data;
        return CALLBACK_SUCCESS;
    }




}