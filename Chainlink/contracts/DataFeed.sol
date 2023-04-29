// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DataFeed {
    /**
     * Network: Sepolia
     */

    address constant public BTC_USD = 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43;
    address constant public ETH_USD = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
    address constant public LINK_USD = 0xc59E3633BAAC79493d908e63626716e204A45EdF;
    address constant public USDC_USD = 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E;
    address constant public DAI_USD = 0x14866185B1962B63C3Ea9E03Bc1da838bab34C19;

    function getBTCPrice() external view returns(int256){
        (
            /* uint80 roundID */,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(BTC_USD).latestRoundData();
        return price;
    }

    function getETHPrice() external view returns(int256){
        ( ,int price, , , ) = AggregatorV3Interface(ETH_USD).latestRoundData();
        return price;
    }

    function getLINKPrice() external view returns(int256){
        ( ,int price, , , ) = AggregatorV3Interface(LINK_USD).latestRoundData();
        return price;
    }

    function getUSDCPrice() external view returns(int256){
        ( ,int price, , , ) = AggregatorV3Interface(USDC_USD).latestRoundData();
        return price;
    }

    function getDAIPrice() external view returns(int256){
        ( ,int price, , , ) = AggregatorV3Interface(DAI_USD).latestRoundData();
        return price;
    }


}
