// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AMM{

    // ~~~~~~~ Immutable variables ~~~~~~~ 
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;
    uint256 public constant BASE_PERCENTAGE = 1000;

    // ~~~~~~~ State variables ~~~~~~~ 
    /* 
     * tradingfee 1000 = 100%
     * tradingfee 500 = 50%
     * tradingfee 50 = 5%
     * tradingfee 5 = 0.5%
     * tradingfee 3 = 0.3%
     */
    uint256 public tradingFeeBase1000;
    uint256 public reserveTokenA;
    uint256 public reserveTokenB;
    uint256 public totalShares;
    mapping (address => uint256) public sharesPerUser;

    constructor(IERC20 _tokenA, IERC20 _tokenB, uint256 _fee){
        require(_fee <= BASE_PERCENTAGE, "AMM: Fee can't bee higher than 1_000 = (100%)");
        tokenA = _tokenA;
        tokenB = _tokenB;
        tradingFeeBase1000 = _fee;
    }  

    // ~~~~~~~ Public/External functions ~~~~~~~  
    function swap(IERC20 _tokenIn, uint256 _amountIn) external returns(uint256 amountOut) {
        require(_tokenIn == tokenA || _tokenIn == tokenB, "AMM: Invalid token");
        address _user = msg.sender;
        address thisContract = address(this);
        //1. transfer tokenIn to address(this)

        uint256 amountIn;
        if(_tokenIn == tokenA){
            //1. transfer tokenIn to address(this)
            tokenA.transferFrom(_user,thisContract,_amountIn);
            //recalculate amountIn for security reasons --> balanceOf - against the reserves
            amountIn = tokenA.balanceOf(thisContract) - reserveTokenA;

            //2. calculate the fee on tokenIn
            uint256 feeTokenIn = _calculateFee(amountIn);

             //3. calculate the amountOut
            amountOut = amountIn - feeTokenIn;

            //4. update the reserve token A and B
            _addReserveA(amountIn);
            _removeReserveB(amountOut);

            //5. transfer amountOut to the user
            require(tokenB.transfer(_user,amountOut),"AMM: Error transfering the funds to the user");

        }else{
            //1. transfer tokenIn to address(this)
            tokenB.transferFrom(_user,thisContract,_amountIn);
            //recalculate amountIn for security reasons --> balanceOf - against the reserves
            amountIn = tokenB.balanceOf(thisContract) - reserveTokenA;

            //2. calculate the fee on tokenIn
            uint256 feeTokenIn = _calculateFee(amountIn);

             //3. calculate the amountOut
            amountOut = amountIn - feeTokenIn;

            //4. update the reserve token A and B
            _addReserveB(amountIn);
            _removeReserveA(amountOut);

            //5. transfer amountOut to the user
            require(tokenA.transfer(_user,amountOut),"AMM: Error transfering the funds to the user");
        }
    }

    function addLiquidity() external {

    }

    function removeLiquidity() external {

    }

    // ~~~~~~~ Internal/Private functions ~~~~~~~ 
    function _mintShares(address _to, uint256 _amount) internal{
        sharesPerUser[_to] += _amount;
        totalShares += _amount;
    }

    function _burnShares(address _from, uint256 _amount) internal{
        sharesPerUser[_from] -= _amount;
        totalShares -= _amount;

    }

    function _addReserveA(uint256 _amountIn) private {
        reserveTokenA += _amountIn;
    }

    function _removeReserveA(uint256 _amountOut) private {
        reserveTokenA -= _amountOut;
    }

    function _addReserveB(uint256 _amountIn) private {
        reserveTokenB += _amountIn;
    }

    function _removeReserveB(uint256 _amountOut) private {
        reserveTokenB -= _amountOut;
    }

    function _calculateFee(uint256 amount) private view returns(uint256){
        return (amount * tradingFeeBase1000) / BASE_PERCENTAGE;
    }

}