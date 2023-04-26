//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Test{

    address constant public UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address constant public WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

/*      uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline 
*/

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutmin,
        address _to
    ) external{
        //1 transfer token from msg.sender to this contract
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        
        //2 approve uniswap router the tokenIn
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn);
        
        //3 create a path with tokenIn, WETH and tokenOut
        address[] memory path = new address[](3);
        path[0] = _tokenIn;
        path[1] = WETH;
        path[2] = _tokenOut;

        IUniswapV2Router02(UNISWAP_V2_ROUTER).swapExactTokensForTokensSupportingFeeOnTransferTokens(
            _amountIn, _amountOutmin, path, _to, block.timestamp 
        );


    }



}