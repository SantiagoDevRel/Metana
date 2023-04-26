//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract AddLiquidity{

    address constant public UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    event Log(string message, uint256 qty);

    function addLiquidity(address _tokenA, address _tokenB, uint256 _amountA, uint256 _amountB) external {
        address _thisContract = address(this);
        address _sender = msg.sender;
        
        //1 transfer the tokens from user to this contract
        IERC20(_tokenA).transferFrom(_sender, _thisContract, _amountA);
        IERC20(_tokenB).transferFrom(_sender, _thisContract, _amountB);

        //2 approve tokens from this contract to uniswap router
        IERC20(_tokenA).approve(UNISWAP_V2_ROUTER, _amountA);
        IERC20(_tokenB).approve(UNISWAP_V2_ROUTER, _amountB);

        //3 call router to add liquidity and get the return values
        (uint256 amountA, uint256 amountB,uint256 liquidity) = IUniswapV2Router02(UNISWAP_V2_ROUTER).addLiquidity(
            _tokenA, 
            _tokenB,
            _amountA,
            _amountB,
            1,
            1,
            _thisContract,
            block.timestamp + 5 minutes
        );

        emit Log("AmountA", amountA);
        emit Log("AmountB", amountB);
        emit Log("Liquidity", liquidity);
    }

}