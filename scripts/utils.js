/* global ethers */

const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

// get function selectors from ABI
function getSelectors(contract) {
  const selectors = [];
  contract.interface.forEachFunction((fragment) => {
    if (fragment.format("sighash") !== "init(bytes)") {
      selectors.push(fragment.selector);
    }
  });
  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;
  return selectors
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove(functionNames) {
  const selectors = this.filter((v) => {
    for (const functionName of functionNames) {
      const f = this.contract.interface.getFunction(functionName);
      if (v === f.format("sighash")) {
        return false;
      }
    }
    return true;
  })
  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;
  return selectors;
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get(functionNames) {
  const selectors = this.filter((v) => {
    for (const functionName of functionNames) {
      const f = this.contract.interface.getFunction(functionName);
      if (v === f.format("sighash")) {
        return true;
      }
    }
    return false;
  })
  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;
  return selectors;
}

exports.FacetCutAction = FacetCutAction;
exports.getSelectors = getSelectors;
