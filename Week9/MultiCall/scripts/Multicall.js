//Multicall that allows to get all the current prices of 4 different chainlink pricefeeds
//calling the function latestAnswer() in each contract.

//imports
const {ethers, BigNumber} = require("ethers");
const {MultiCall} = require('@indexed-finance/multicall');
//we can use this ABI from the json or just directly the one in the line 20.    
const { abi } = require("../artifacts/contracts/AggregatorInterface.sol/AggregatorInterface.json")

//constants (instance of provider and addresses of the pricefeeds we will call)
const provider = new ethers.providers.InfuraProvider("homestead")
const BTC_USD_DATAFEED = "0xf4030086522a5beea4988f8ca5b36dbc97bee88c"
const ETH_USD_DATAFEED = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
const MATIC_USD_DATAFEED = "0x7bac85a8a13a4bcd8abb3eb7d6b4d632c5a57676"
const BNB_USD_DATAFEED = "0x14e613ac84a31f709eadbdf89c6cc390fdc9540a"
const targets = [BTC_USD_DATAFEED, ETH_USD_DATAFEED, MATIC_USD_DATAFEED, BNB_USD_DATAFEED]

//This is the only function we will call in those 4 contracts
//so this is our "interface" or "ABI" we need. just the signature of that function
const ABI_AggregatorV2V3 =  ["function latestAnswer() view returns (uint256)"]

async function main(){

    //instance the Multicall class
    const multi = new MultiCall(provider);
    const inputs = []

    //push the targets(addresses of the pricefeeds) and function name 
    //into the array inputs use it later to call the pricefeeds
    for(let i=0;i<targets.length;i++){
        inputs.push({
            target: targets[i],
            function: "latestAnswer",
        })
    }

    return result = await multi.multiCall(ABI_AggregatorV2V3, inputs)
}

/* 
    * call main() function and use promises to format the answer which is an array of BigNumbers
    * result --> array with two values: the first is a number which is the block number the data was from
        and second is an array with the decoded return data from each call.
*/
main().then((result)=>{
    const tokens = ["BTC", "ETH", "MATIC", "BNB"]
    console.log(`Data from block${result[0]}`)

    for(let i=0;i<result[1].length;i++){
        const value = (result[1][i]).toString()
        const formatedValue = parseInt(value) / 10**8
        console.log(`${tokens[i]} = ${formatedValue}`)   
    }
})


