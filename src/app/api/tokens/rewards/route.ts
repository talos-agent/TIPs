import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Placeholder for the Platform contract ABI and address
const platformAbi = [/* ABI of Platform */];
const platformAddress = "0x..."; // Address of the deployed Platform contract

export async function POST(request: Request) {
  try {
    const { streamerAddress, durationInMinutes, viewers, category } = await request.json();

    if (!streamerAddress || !durationInMinutes || !viewers || !category) {
      return NextResponse.json({ msg: 'Missing required fields' }, { status: 400 });
    }

    // In a real application, you would use a secure way to manage your private keys.
    // For this MVP, we will use a placeholder private key.
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

    const platformContract = new ethers.Contract(platformAddress, platformAbi, signer);

    const tx = await platformContract.distributeReward(streamerAddress, durationInMinutes, viewers, category);
    await tx.wait();

    return NextResponse.json({ msg: 'Rewards distributed successfully', txHash: tx.hash });
  } catch (error) {
    console.error('Error distributing rewards:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
