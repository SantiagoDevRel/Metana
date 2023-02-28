// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
    Forging Contract:
        * FORGING --> Mint & Burn. 
            * Token 3 = token 0 + token 1
            * Token 4 = token 1 + token 2
            * Token 5 = token 0 + token 2
            * Token 6 = token 0 + token 1 + token 2
*/

import "./MultiToken.sol";

contract Forging {

    //Instance of the ERC1155
    MultiToken private token;

    constructor(MultiToken _token){
        token = _token;
    }

    //mapping to track the timestamp when the user mint
    //user can mint only every 1 minute (recommended to mint once in batchs instead of token by token)
    mapping(address => uint) private timeMinted;

    function mintBatchToken(uint [] memory _tokenIds, uint [] memory _amount) public {
        require(timeMinted[msg.sender] + 1 minutes < block.timestamp, "FORGING: Please wait 1 minute.");
        require(_tokenIds[0] == 0 && _tokenIds[1] == 1 && _tokenIds[2] == 2 && _tokenIds.length <= 3, "FORGING: You can mint only tokens 0,1 and 2.");
        token.mintBatch(msg.sender, _tokenIds, _amount);
        timeMinted[msg.sender] = block.timestamp;
    }


    /*
                     Furging function:
                     
           | YOU BURN |             | YOU GET |
        token 0 + token 1        =    Token 3 
        token 1 + token 2        =    Token 4 
        token 0 + token 2        =    Token 5
        token 0 + token 1 + token 2 = Token 6
    */

    function forgeTokens(uint[] memory ids, uint [] memory amounts) public {
        uint totalAmountToMint = amounts[0];
        for(uint i=0;i<amounts.length-1;){
            //check all the amounts are equal
            assert(amounts[i] == amounts[i+1]);
            unchecked{
                i++;
            }
        }

        if(ids.length >= 3 && ids[0] == 0 && ids[1] == 1){
            if(ids[2] == 2){
            //get token 6
            _burnAndMint(6, totalAmountToMint, ids, amounts);
            }else{
                //get token 3 
                _burnAndMint(3, totalAmountToMint, ids, amounts);
            }
        }else{
            if(ids[0] == 0 && ids[1] == 1){
                //get token 3
                _burnAndMint(3, totalAmountToMint, ids, amounts);
            }
            else if(ids[0] == 1 && ids[1] == 2){
                //get token 4
                _burnAndMint(4, totalAmountToMint, ids, amounts);
            }
            else if(ids[0] == 0 && ids[1] == 2){
                //get token 5
                _burnAndMint(5, totalAmountToMint, ids, amounts);
            }
            else{
                //burn tokens 3,4,5,6 and get nothing back.
                token.burnBatch(msg.sender, ids, amounts);
            }
        }
    }

    function _burnAndMint(uint tokenIdToMint, uint amountToMint, uint[] memory idsToBurn, uint[] memory amountsToBurn) internal{
        token.burnBatch(msg.sender, idsToBurn, amountsToBurn);
        token.mint(msg.sender, tokenIdToMint, amountToMint);
    }

    /*
        * Trade function
        * user can trade tokens 0, 1 and 3 with each other 
        * user will receive the same quantity of tokens burned
        * ex: user sends x5 tokens0, user will receive x5 tokens1
    */

    function tradeTokens(uint _tokenIdGive, uint _amountToExchange, uint _tokenIdReceive) public {
        if(_tokenIdGive > 2 || _tokenIdReceive > 2){
            revert("FORGING: You can trade only tokens 0,1, and 2.");
        }
        token.burn(msg.sender, _tokenIdGive, _amountToExchange);
        token.mint(msg.sender, _tokenIdReceive, _amountToExchange);
    }

}
