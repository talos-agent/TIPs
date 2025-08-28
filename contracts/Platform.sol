// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./UNIOToken.sol";

contract Platform is Ownable {
    UNIOToken public unioToken;

    uint256 public baseReward = 0.1 * 10**18; // 0.1 UNIO per minute
    // For simplicity, we will use fixed bonuses and multipliers for the MVP
    uint256 public viewerBonus = 5 * 10**18;
    uint256 public durationBonus = 10 * 10**18;
    mapping(string => uint256) public categoryMultipliers;

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        unioToken = UNIOToken(tokenAddress);

        // Initialize category multipliers
        categoryMultipliers["Education"] = 130; // 1.3x
        categoryMultipliers["Sports"] = 125; // 1.25x
        categoryMultipliers["Gaming"] = 120; // 1.2x
    }

    function calculateReward(uint256 durationInMinutes, uint256 viewers, string memory category) public view returns (uint256) {
        uint256 totalReward = (baseReward * durationInMinutes + viewerBonus * viewers + durationBonus) * categoryMultipliers[category] / 100;
        return totalReward;
    }

    function distributeReward(address streamer, uint256 durationInMinutes, uint256 viewers, string memory category) public onlyOwner {
        uint256 rewardAmount = calculateReward(durationInMinutes, viewers, category);
        unioToken.mint(streamer, rewardAmount);
    }

    function setBaseReward(uint256 _baseReward) public onlyOwner {
        baseReward = _baseReward;
    }

    function setCategoryMultiplier(string memory category, uint256 multiplier) public onlyOwner {
        categoryMultipliers[category] = multiplier;
    }
}
