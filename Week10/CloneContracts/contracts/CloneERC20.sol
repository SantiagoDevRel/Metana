// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
//import * as Clones from "@openzeppelin/contracts/proxy/Clones.sol";

contract FactoryERC20 { //tx cost = 2,290,306 

    using Clones for address;

    ERC20PresetFixedSupply[] tokensCreatedWithNew;
    address[] tokensCreatedWithClone;

    function createTokenWithNew(//tx cost = 1,317,294  
        string calldata _name,
        string calldata _symbol,
        uint256 _initialSupply
    ) external {
        ERC20PresetFixedSupply _token = new ERC20PresetFixedSupply(
            _name,
            _symbol,
            _initialSupply,
            msg.sender
        );
        tokensCreatedWithNew.push(_token);
    }

    function createTokenWithClones(//tx cost = 107,470 
        address _implementation
    ) external {
        address _token = _implementation.clone();
        tokensCreatedWithClone.push(_token);
    }

     function getTokensNew() external view returns (ERC20PresetFixedSupply[] memory) {
        return tokensCreatedWithNew;
    }

     function getTokensClone() external view returns (address[] memory) {
        return tokensCreatedWithClone;
    }
}
