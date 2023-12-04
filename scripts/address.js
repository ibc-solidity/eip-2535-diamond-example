function saveContractAddresses(addresses) {
  const path = require("path");
  const fs = require("fs");
  const envFile = path.join(__dirname, "..", network.name + ".env.sh");
  let content = "";
  for (const [key, value] of Object.entries(addresses)) {
    content += `export ${key}=${value}\n`;
  }
  fs.writeFileSync(envFile, content);
}

exports.saveContractAddresses = saveContractAddresses;
