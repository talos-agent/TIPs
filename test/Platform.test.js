const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Platform", function () {
  let UNIOToken, unioToken, Platform, platform, owner, addr1;

  // Placeholders for the contract ABIs and bytecode.
  const unioTokenAbi = [/* ABI of UNIOToken */];
  const unioTokenBytecode = "0x..."; // Bytecode of UNIOToken
  const platformAbi = [/* ABI of Platform */];
  const platformBytecode = "0x..."; // Bytecode of Platform

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const UNIOTokenFactory = new ethers.ContractFactory(unioTokenAbi, unioTokenBytecode, owner);
    unioToken = await UNIOTokenFactory.deploy(owner.address);

    const PlatformFactory = new ethers.ContractFactory(platformAbi, platformBytecode, owner);
    platform = await PlatformFactory.deploy(unioToken.target, owner.address);

    // Transfer ownership of UNIOToken to the Platform contract
    await unioToken.transferOwnership(platform.target);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await platform.owner()).to.equal(owner.address);
    });

    it("Should set the correct token address", async function () {
      expect(await platform.unioToken()).to.equal(unioToken.target);
    });
  });

  describe("Reward Calculation", function () {
    it("Should calculate the reward correctly", async function () {
      const duration = 10; // 10 minutes
      const viewers = 100;
      const category = "Gaming";
      const expectedReward = (0.1 * 10**18 * duration + 5 * 10**18 * viewers + 10 * 10**18) * 120 / 100;
      expect(await platform.calculateReward(duration, viewers, category)).to.equal(expectedReward);
    });
  });

  describe("Reward Distribution", function () {
    it("Should distribute rewards to the streamer", async function () {
      const duration = 10;
      const viewers = 100;
      const category = "Gaming";
      const rewardAmount = await platform.calculateReward(duration, viewers, category);

      await platform.distributeReward(addr1.address, duration, viewers, category);

      const addr1Balance = await unioToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(rewardAmount);
    });

    it("Should only allow the owner to distribute rewards", async function () {
      await expect(
        platform.connect(addr1).distributeReward(addr1.address, 10, 100, "Gaming")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Parameter Settings", function () {
    it("Should allow the owner to set the base reward", async function () {
      const newBaseReward = 0.2 * 10**18;
      await platform.setBaseReward(newBaseReward);
      expect(await platform.baseReward()).to.equal(newBaseReward);
    });

    it("Should not allow non-owners to set the base reward", async function () {
        await expect(
            platform.connect(addr1).setBaseReward(0.2 * 10**18)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
