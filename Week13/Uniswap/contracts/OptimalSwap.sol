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

    event Log(string message, uint256 qty);


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
        
        uint256 optimalAmount;
        if(IUniswapV2Pair(pair).token0() == _tokenA){
            //4 get optimal swap amount
            optimalAmount = _getSwapAmount(_amountA, reserve0);
        }else{
            //4 get optimal swap amount
            optimalAmount = _getSwapAmount(_amountA, reserve1);
        }

        //5 swap tokenA for tokenB
        swap(_tokenA, _tokenB, optimalAmount, address(this));

        //6 add liquidity
        uint256 a = IERC20(_tokenA).balanceOf(address(this));
        uint256 b = IERC20(_tokenB).balanceOf(address(this));
        addLiquidity(_tokenA, _tokenB, a, b);
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
        address _to
    ) public {
        //1 approve uniswap router the tokenIn
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn);
        
        //2 create a path with tokenIn, WETH and tokenOut
        address[] memory path = new address[](3);
        path[0] = _tokenIn;
        path[1] = WETH;
        path[2] = _tokenOut;

        IUniswapV2Router02(UNISWAP_V2_ROUTER).swapExactTokensForTokensSupportingFeeOnTransferTokens(
            _amountIn, 1, path, _to, block.timestamp 
        );


    }

    function addLiquidity(address _tokenA, address _tokenB, uint256 _amountA, uint256 _amountB) public {
        //1 approve tokens from this contract to uniswap router
        IERC20(_tokenA).approve(UNISWAP_V2_ROUTER, _amountA);
        IERC20(_tokenB).approve(UNISWAP_V2_ROUTER, _amountB);

        //2 call router to add liquidity and get the return values
        (uint256 amountA, uint256 amountB,uint256 liquidity) = IUniswapV2Router02(UNISWAP_V2_ROUTER).addLiquidity(
            _tokenA, 
            _tokenB,
            _amountA,
            _amountB,
            1,
            1,
            msg.sender, //<= mint the shares to this address
            block.timestamp + 5 minutes
        );

        emit Log("AmountA", amountA);
        emit Log("AmountB", amountB);
        emit Log("Liquidity", liquidity);
    }

    function getBalance(address _pair) external view returns(uint256){
        return IUniswapV2Pair(_pair).balanceOf(msg.sender);
    }

}