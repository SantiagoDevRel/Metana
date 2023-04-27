//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract OptimalSwap{

    using Math for uint256;
    using SafeMath for uint256;

    address constant public UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address constant public UNISWAP_V2_FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address constant public WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;


    function swapAndAdd(address _tokenA, address _tokenB, uint256 _amountA) external {       
        //1 transfer tokenA to this contract
        require(IERC20(_tokenA).transferFrom(msg.sender, address(this),_amountA));     
        
        //2 get pair address
        address pair = _getPair(_tokenA, _tokenB);

        //3 get reserves of the pair
        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pair).getReserves();
        
        if(IUniswapV2Pair(pair).token0() == _tokenA){
            //4 get optimal swap amount
            uint256 optimalAmount = _getSwapAmount(_amountA, reserve0);

            //5 swap tokenA for tokenB
            swap(_tokenA, _tokenB, optimalAmount, 1, msg.sender);

        }else{
            //4 get optimal swap amount
            uint256 optimalAmount = _getSwapAmount(_amountA, reserve1);
            
            //5 swap tokenA for tokenB

        }


    }

    function _getSwapAmount(uint256 tokenUser, uint256 reserve) internal pure returns(uint256){
        return (_sqrt(reserve.mul(reserve.mul(3988009) + tokenUser.mul(3988000))).sub(reserve.mul(1997))) / 1994;
    }

    function _getPair(address _tokenA, address _tokenB) internal view returns(address){
        return IUniswapV2Factory(UNISWAP_V2_FACTORY).getPair(_tokenA, _tokenB);
    }

    function _sqrt(uint256 _number) internal pure returns(uint256){
        return _number.sqrt();
    }

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutmin,
        address _to
    ) public {
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