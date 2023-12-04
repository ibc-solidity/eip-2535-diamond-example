# eip-2535-diamond-example

This repository provides an [EIP-2535](https://eips.ethereum.org/EIPS/eip-2535) Diamond-proxy with [ibc-solidity](https://github.com/hyperledger-labs/yui-ibc-solidity).

The implementation is based on https://github.com/mudgen/diamond-2-hardhat.

## Concept

The ibc-solidity is split into several logic contracts due to ethereum's contract size limitation. Such contracts include IBCClient, IBCConnection, IBCChannelHandshake, etc., which implement a handler interface to their respective functions.

Therefore, it is possible to map each of these logic contracts to a diamond facet and add them to one diamond to compose one complete IBC handler.

## How to run

```sh
$ npx hardhat run ./scripts/deploy.js
```
