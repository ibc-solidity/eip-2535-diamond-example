const { deployDiamond, deployIBFT2Client, deployIBCMockApp } = require("../scripts/deploy");
const { assert } = require('chai');

describe('DiamondTest', async function () {
    let contractOwner;
    let diamondAddress;
    let ibcHandler;

    before(async function () {
        const [acc0] = await hre.ethers.getSigners();
        contractOwner = acc0;
        diamondAddress = await deployDiamond(contractOwner);
        ibcHandler = await ethers.getContractAt('IIBCHandler', diamondAddress);
    })

    it('should deploy', async function () {
        assert.notEqual(diamondAddress, 0);
    })

    it('should returns the correct prefix', async function () {
        const prefix = await ibcHandler.getCommitmentPrefix();
        assert.equal(prefix, 0x696263);
    })

    it('should successfully register a client', async function () {
        const ibft2Client = await deployIBFT2Client(contractOwner, ibcHandler);
        const client = await ibcHandler.getClientByType("hb-ibft2");
        assert.equal(client, ibft2Client.target);
    })

    it('should successfully bind a port', async function () {
        await deployIBCMockApp(contractOwner, ibcHandler);
    })
})
