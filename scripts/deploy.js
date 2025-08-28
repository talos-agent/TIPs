const { ethers } = require("ethers");

async function main() {
  // In a real deployment, you would get a signer from a wallet or a node provider.
  // For this example, we will use a placeholder.
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const signer = await provider.getSigner();

  console.log("Deploying contracts with the account:", signer.address);

  // Placeholder for the contract ABI and bytecode.
  // In a real project, you would import these from the compiled contract artifacts.
  const unioTokenAbi = [/* ABI of UNIOToken */];
  const unioTokenBytecode = "0x..."; // Bytecode of UNIOToken
  const platformAbi = [/* ABI of Platform */];
  const platformBytecode = "0x..."; // Bytecode of Platform

  // Deploy UNIOToken
  const UNIOToken = new ethers.ContractFactory(unioTokenAbi, unioTokenBytecode, signer);
  const unioToken = await UNIOToken.deploy(signer.address);
  await unioToken.waitForDeployment();
  console.log("UNIOToken deployed to:", unioToken.target);

  // Deploy Platform
  const Platform = new ethers.ContractFactory(platformAbi, platformBytecode, signer);
  const platform = await Platform.deploy(unioToken.target, signer.address);
  await platform.waitForDeployment();
  console.log("Platform deployed to:", platform.target);

  // Transfer ownership of UNIOToken to the Platform contract
  await unioToken.transferOwnership(platform.target);
  console.log("UNIOToken ownership transferred to Platform contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
