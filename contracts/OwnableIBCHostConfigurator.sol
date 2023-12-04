// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import {
    IBCHostConfigurator,
    ILightClient,
    IIBCModule
} from "@hyperledger-labs/yui-ibc-solidity/contracts/core/24-host/IBCHostConfigurator.sol";
import {LibDiamond} from "diamond-2-hardhat/contracts/libraries/LibDiamond.sol";

contract OwnableIBCHostConfigurator is IBCHostConfigurator {
    modifier onlyOwner() {
        require(LibDiamond.contractOwner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function registerClient(string calldata clientType, ILightClient client) public onlyOwner {
        super._registerClient(clientType, client);
    }

    function bindPort(string calldata portId, IIBCModule moduleAddress) public onlyOwner {
        super._bindPort(portId, moduleAddress);
    }

    function setExpectedTimePerBlock(uint64 expectedTimePerBlock_) public onlyOwner {
        super._setExpectedTimePerBlock(expectedTimePerBlock_);
    }
}
