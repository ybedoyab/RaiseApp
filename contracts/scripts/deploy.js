const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  // Get the network
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);
  
  // Get the deployer's address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from address:", deployer.address);
  
  // Get the deployer's balance
  const balance = await deployer.getBalance();
  console.log("Deployer balance:", hre.ethers.utils.formatEther(balance), "ETH");

  console.log("Deploying InvestmentCampaign contract...");
  const InvestmentCampaign = await hre.ethers.getContractFactory("InvestmentCampaign");
  const investmentCampaign = await InvestmentCampaign.deploy();

  console.log("Waiting for deployment transaction...");
  await investmentCampaign.deployed();

  console.log("InvestmentCampaign deployed to:", investmentCampaign.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed!");
    console.error(error);
    process.exit(1);
  }); 