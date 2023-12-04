// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import {LibDiamond} from "diamond-2-hardhat/contracts/libraries/LibDiamond.sol";
import {IDiamondLoupe} from "diamond-2-hardhat/contracts/interfaces/IDiamondLoupe.sol";
import {IDiamondCut} from "diamond-2-hardhat/contracts/interfaces/IDiamondCut.sol";
import {IERC173} from "diamond-2-hardhat/contracts/interfaces/IERC173.sol";
import {IERC165} from "diamond-2-hardhat/contracts/interfaces/IERC165.sol";
import {IIBCHandler} from "@hyperledger-labs/yui-ibc-solidity/contracts/core/25-handler/IIBCHandler.sol";
import {IBCStore} from "@hyperledger-labs/yui-ibc-solidity/contracts/core/24-host/IBCStore.sol";

contract DiamondInit is IBCStore {
    function init() external {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;
        ds.supportedInterfaces[type(IIBCHandler).interfaceId] = true;
    }
}
