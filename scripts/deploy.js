/* eslint prefer-const: "off" */

const { getSelectors, FacetCutAction } = require('./utils.js');
const { saveContractAddresses } = require('./address.js');

const ibft2ClientType = "hb-ibft2";
const mockAppPortId = "mockapp";

async function deploy(deployer, contractName, args = []) {
  const factory = await hre.ethers.getContractFactory(contractName);
  const contract = await factory.connect(deployer).deploy(...args);
  await contract.waitForDeployment();
  return contract;
}

async function deployDiamond(contractOwner) {
  const diamondCutFacet = await deploy(contractOwner, 'DiamondCutFacet');
  console.log('DiamondCutFacet deployed:', diamondCutFacet.target);

  // deploy Diamond
  const diamond = await deploy(contractOwner, 'Diamond', [contractOwner.address, diamondCutFacet.target]);
  console.log('Diamond deployed:', diamond.target);

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const diamondInit = await deploy(contractOwner, 'DiamondInit');
  console.log('DiamondInit deployed:', diamondInit.target);

  // deploy facets
  console.log('');
  console.log('Deploying facets');
  const FacetNames = [
    'DiamondLoupeFacet',
    'OwnershipFacet',

    'IBCClient',
    'IBCConnectionSelfStateNoValidation',
    'IBCChannelHandshake',
    'IBCChannelPacketSendRecv',
    'IBCChannelPacketTimeout',
    'OwnableIBCHostConfigurator',
    'IBCQuerier'
  ];
  const cut = [];
  for (const FacetName of FacetNames) {
    const facet = await deploy(contractOwner, FacetName);
    console.log(`${FacetName} deployed: ${facet.target}`);
    cut.push({
      facetAddress: facet.target,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet)
    });
  }

  // upgrade diamond with facets
  console.log('');
  console.log('Diamond Cut:', cut);
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.target);
  let tx;
  let receipt;
  // call to init function
  const functionCall = diamondInit.interface.encodeFunctionData('init');
  tx = await diamondCut.diamondCut(cut, diamondInit.target, functionCall);
  console.log('Diamond cut tx: ', tx.hash);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  console.log('Completed diamond cut');
  return diamond.target;
}

async function deployIBFT2Client(contractOwner, ibcHandler) {
  const ibft2Client = await deploy(contractOwner, "IBFT2Client", [ibcHandler.target]);
  console.log("IBFT2Client address:", ibft2Client.target);
  await ibcHandler.registerClient(ibft2ClientType, ibft2Client.target);
  return ibft2Client;
}

async function deployIBCMockApp(contractOwner, ibcHandler) {
  const ibcMockApp = await deploy(contractOwner, "IBCMockApp", [ibcHandler.target]);
  console.log("IBCMockApp address:", ibcMockApp.target);
  await ibcHandler.bindPort(mockAppPortId, ibcMockApp.target);
  return ibcMockApp;
}

async function main() {
  const [contractOwner] = await ethers.getSigners();
  const diamondAddress = await deployDiamond(contractOwner);
  const ibcHandler = await ethers.getContractAt('IIBCHandler', diamondAddress);
  const ibft2Client = deployIBFT2Client(contractOwner, ibcHandler);
  const ibcMockApp = deployIBCMockApp(contractOwner, ibcHandler);

  saveContractAddresses({
    IBC_HANDLER: ibcHandler.target,
    IBFT2_CLIENT: ibft2Client.target,
    IBC_MOCKAPP: ibcMockApp.target
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

exports.deployDiamond = deployDiamond;
exports.deployIBFT2Client = deployIBFT2Client;
exports.deployIBCMockApp = deployIBCMockApp;
