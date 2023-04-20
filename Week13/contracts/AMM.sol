// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AMM{

    // ~~~~~~~ Immutable variables ~~~~~~~ 
    IERC20 private immutable tokenA;
    IERC20 private immutable tokenB;
    uint256 private constant BASE_PERCENTAGE = 1000;

    // ~~~~~~~ State variables ~~~~~~~ 
    /* 
     * tradingfee 1000 = 100%
     * tradingfee 500 = 50%
     * tradingfee 50 = 5%
     * tradingfee 5 = 0.5%
     * tradingfee 3 = 0.3%
     */
    uint256 private tradingFeeBase1000;
    uint256 private reserveTokenA;
    uint256 private reserveTokenB;
    uint256 private totalShares;
    mapping (address => uint256) private sharesPerUser;

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
        address _thisContract = address(this);
        //1. transfer tokenIn to address(this)


        uint256 amountIn;
        if(_tokenIn == tokenA){
            require(getReserveB() > 0,"AMM: Insufficient liquidity of token B to swap");
            //1. transfer tokenIn to address(this)
            tokenA.transferFrom(_user,_thisContract,_amountIn);
            //recalculate amountIn for security reasons --> balanceOf - against the reserves
            amountIn = tokenA.balanceOf(_thisContract) - reserveTokenA;

            //2. calculate the fee on tokenIn
            uint256 feeTokenIn = _calculateFee(amountIn);

             //3. calculate the amountOut
            amountOut = amountIn - feeTokenIn;

            //4. update the reserve token A and B
            _increaseReserveA(amountIn);
            _decreaseReserveB(amountOut);

            //5. transfer amountOut to the user
            require(tokenB.transfer(_user,amountOut),"AMM: Error transfering the funds to the user");

        }else{
            require(getReserveA() > 0,"AMM: Insufficient liquidity of token A to swap");
            //1. transfer tokenIn to address(this)
            tokenB.transferFrom(_user,_thisContract,_amountIn);
            //recalculate amountIn for security reasons --> balanceOf - against the reserves
            amountIn = tokenB.balanceOf(_thisContract) - reserveTokenA;

            //2. calculate the fee on tokenIn
            uint256 feeTokenIn = _calculateFee(amountIn);

             //3. calculate the amountOut
            amountOut = amountIn - feeTokenIn;

            //4. update the reserve token A and B
            _increaseReserveB(amountIn);
            _decreaseReserveA(amountOut);

            //5. transfer amountOut to the user
            require(tokenA.transfer(_user,amountOut),"AMM: Error transfering the funds to the user");
        }
    }

    function addLiquidity(uint256 _amountTokenA, uint256 _amountTokenB) external returns(uint256 sharesToMint) {
        //transfer tokens from user to thisContract
        address _thisContract = address(this);
        address _user = msg.sender;
        require(tokenA.transferFrom(_user, _thisContract, _amountTokenA),"AMM: Failed transfering token A");
        require(tokenB.transferFrom(_user,_thisContract, _amountTokenB),"AMM: Failed transfering token B");

        //recalculate the amounts in for security reasons
        uint256 _amountA = tokenA.balanceOf(_thisContract) - reserveTokenA;
        uint256 _amountB = tokenB.balanceOf(_thisContract) - reserveTokenB;

        //calculate shares
        sharesToMint = _calculateSharesToMint(_amountA, _amountB);
        require(sharesToMint>0, "AMM: Shares can't be 0");
        _mintShares(_user, sharesToMint);

        //update the reserves
        _increaseReserveA(_amountA);
        _increaseReserveB(_amountB);
    }

    function removeLiquidity(uint256 _sharesToBurn) external returns(uint256 tokenAOut, uint256 tokenBOut){
        address _user = msg.sender;

        //burn the shares
        _burnShares(_user, _sharesToBurn);

        //calculate the amount of tokens to give to the user
        (tokenAOut, tokenBOut) = _calculateAmountsOut(_sharesToBurn);

        //decrease both reserves with the token amounts
        _decreaseReserveA(tokenAOut);
        _decreaseReserveB(tokenBOut);

        //transfer both tokens back to the user
        if(tokenAOut > 0){
            tokenA.transfer(_user, tokenAOut);
        }
        if(tokenBOut > 0){
            tokenB.transfer(_user, tokenBOut);
        }
    }

    // ~~~~~~~ Internal/Private functions ~~~~~~~ 
    function _calculateSharesToMint(uint256 _amountA, uint256 _amountB) private view returns(uint256){
        if(getTotalShares() > 0){
            return ((_amountA + _amountB) * getTotalShares()) / (getReserveA() - getReserveB());
        }
        return (_amountA + _amountB);
    }

    function _calculateAmountsOut(uint256 _sharesToBurn) private view returns(uint256 _tokenAOut, uint256 _tokenBOut){
        _tokenAOut = (getReserveA()*_sharesToBurn) / getTotalShares();
        _tokenBOut = (getReserveB() * _sharesToBurn) / getTotalShares();
    }
    
    function _mintShares(address _to, uint256 _amount) internal{
        sharesPerUser[_to] += _amount;
        totalShares += _amount;
    }

    function _burnShares(address _from, uint256 _amount) internal{
        sharesPerUser[_from] -= _amount;
        totalShares -= _amount;

    }

    function _increaseReserveA(uint256 _amountIn) private {
        reserveTokenA += _amountIn;
    }

    function _decreaseReserveA(uint256 _amountOut) private {
        reserveTokenA -= _amountOut;
    }

    function _increaseReserveB(uint256 _amountIn) private {
        reserveTokenB += _amountIn;
    }

    function _decreaseReserveB(uint256 _amountOut) private {
        reserveTokenB -= _amountOut;
    }

    function _calculateFee(uint256 amount) private view returns(uint256){
        return (amount * tradingFeeBase1000) / BASE_PERCENTAGE;
    }

    // ~~~~~~~ Pure/View functions ~~~~~~~ 
    function getReserveA() public view returns(uint256){
        return reserveTokenA;
    }
    
    function getReserveB() public view returns(uint256){
        return reserveTokenB;
    }

    function getTotalShares() public view returns(uint256){
        return totalShares;
    }

    function basePercentage() public pure returns(uint256){
        return BASE_PERCENTAGE;
    }

    function currentFee() public view returns(uint256){
        return tradingFeeBase1000;
    }

    function shares(address user) public view returns(uint256){
        return sharesPerUser[user];
    }

    function addressTokenA() public view returns(IERC20){
        return tokenA;
    }

    function addressTokenB() public view returns(IERC20){
        return tokenB;
    }

}