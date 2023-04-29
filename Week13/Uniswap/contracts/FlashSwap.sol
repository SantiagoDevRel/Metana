//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract FlashSwap is IUniswapV2Callee {

    event Log(string message, uint256 value);

    address constant public UNISWAP_ROUTER_V2 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address constant public WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address constant public UNISWAP_FACTORY_V2 = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; 

    function flashSwap(address _tokenToBorrow, uint256 _amountToBorrow) external{
        //1 get pair of WETH and the tokenToBorrow
        address pair = IUniswapV2Factory(UNISWAP_FACTORY_V2).getPair(_tokenToBorrow, WETH);
        require(pair != address(0), "FlashSwap: Pair doesn't exist");

        //2 get token0 and token1 from the pair to know which one is which
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();

        //3 set the amountOut as same of the tokenToBorrow
        //  and set the other amountOut to 0
        uint256 _amount0Out = token0 == _tokenToBorrow ? _amountToBorrow : 0;
        uint256 _amount1Out = token1 == _tokenToBorrow ? _amountToBorrow : 0;

        //4 swap
        // if last parameter (data == "") is empty, it will do a normal swap
        // we need to pass data to trigger the uniswapV2Callee call
        bytes memory data = abi.encode(_tokenToBorrow, _amountToBorrow);

        IUniswapV2Pair(pair).swap(_amount0Out, _amount1Out, address(this), data);
        
        //5 that data will trigger a callback in address(this) in the function uniswapV2Call()
    }

   


}
