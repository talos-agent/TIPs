const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UNIOToken", function () {
  let UNIOToken, unioToken, owner, addr1, addr2;

  // Placeholder for the contract ABI and bytecode.
  const unioTokenAbi = [/* ABI of UNIOToken */];
  const unioTokenBytecode = "0x..."; // Bytecode of UNIOToken

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const UNIOTokenFactory = new ethers.ContractFactory(unioTokenAbi, unioTokenBytecode, owner);
    unioToken = await UNIOTokenFactory.deploy(owner.address);
    // await unioToken.deployed(); // this is deprecated
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await unioToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await unioToken.balanceOf(owner.address);
      expect(await unioToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have the correct name and symbol", async function () {
        expect(await unioToken.name()).to.equal("Uniao Token");
        expect(await unioToken.symbol()).to.equal("UNIO");
    });
  });

  describe("Transactions", function () {
    it("Should mint tokens to a given address", async function () {
      await unioToken.mint(addr1.address, 100);
      const addr1Balance = await unioToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);
    });

    it("Should only allow the owner to mint tokens", async function () {
      await expect(
        unioToken.connect(addr1).mint(addr2.address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should burn tokens from a given address", async function () {
        await unioToken.mint(addr1.address, 100);
        await unioToken.connect(addr1).burn(50);
        const addr1Balance = await unioToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(50);
    });
  });
});
