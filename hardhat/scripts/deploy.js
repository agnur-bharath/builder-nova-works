require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const ChatNFT = await hre.ethers.getContractFactory("ChatNFT");
  const chatNFT = await ChatNFT.deploy();
  await chatNFT.deployed();
  console.log("ChatNFT deployed to:", chatNFT.address);

  const ChatMessages = await hre.ethers.getContractFactory("ChatMessages");
  const chatMessages = await ChatMessages.deploy(chatNFT.address);
  await chatMessages.deployed();
  console.log("ChatMessages deployed to:", chatMessages.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
