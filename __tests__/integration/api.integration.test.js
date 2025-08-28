const { expect } = require("chai");
const { ethers } = require("hardhat");
const { POST: createStream } = require("../../../src/app/api/streams/route");
const { POST: distributeRewards } = require("../../../src/app/api/tokens/rewards/route");
const { prisma } = require("../../../src/lib/prisma");

// Mock the prisma client
jest.mock('../../../src/lib/prisma', () => ({
    prisma: {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      stream: {
        create: jest.fn(),
      },
    },
}));

// Mock the ethers library
jest.mock('ethers', () => {
    const originalEthers = jest.requireActual('ethers');
    return {
        ...originalEthers,
        Contract: jest.fn().mockImplementation(() => ({
            distributeReward: jest.fn().mockResolvedValue({
                hash: '0xmocktxhash',
                wait: jest.fn().mockResolvedValue({}),
            }),
        })),
    };
});


describe("API Integration Tests", function () {
  let owner, streamer;

  beforeEach(async function () {
    [owner, streamer] = await ethers.getSigners();
    jest.clearAllMocks();
  });

  it("should create a stream and distribute rewards", async function () {
    // 1. Mock the database calls
    const mockUser = { id: '1', walletAddress: streamer.address, username: 'streamer1' };
    const mockStream = { id: '1', streamKey: 'sk_123...', userId: '1' };
    prisma.user.findUnique.mockResolvedValue(null); // User does not exist initially
    prisma.user.create.mockResolvedValue(mockUser);
    prisma.stream.create.mockResolvedValue(mockStream);

    // 2. Call the createStream API endpoint
    const createStreamRequest = new Request('http://localhost/api/streams', {
      method: 'POST',
    });
    const createStreamResponse = await createStream(createStreamRequest);
    const createdStream = await createStreamResponse.json();

    expect(createStreamResponse.status).toBe(201);
    expect(createdStream.streamKey).toBeDefined();

    // 3. Call the distributeRewards API endpoint
    const distributeRewardsRequest = new Request('http://localhost/api/tokens/rewards', {
        method: 'POST',
        body: JSON.stringify({
            streamerAddress: streamer.address,
            durationInMinutes: 10,
            viewers: 100,
            category: 'Gaming'
        }),
    });
    const distributeRewardsResponse = await distributeRewards(distributeRewardsRequest);
    const rewardBody = await distributeRewardsResponse.json();

    expect(distributeRewardsResponse.status).toBe(200);
    expect(rewardBody.msg).toBe('Rewards distributed successfully');

    // 4. Verify that the distributeReward function on the contract was called
    const { Contract } = require('ethers');
    const platformContractInstance = Contract.mock.instances[0];
    expect(platformContractInstance.distributeReward).toHaveBeenCalledWith(
        streamer.address,
        10,
        100,
        'Gaming'
    );
  });
});
