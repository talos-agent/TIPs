import React, { useEffect, useState } from 'react';

interface Nft {
  id: string;
  name: string;
  description: string;
  image: string;
}

const NftGallery: React.FC = () => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch the user's NFTs from an API.
    // For this MVP, we will use mock data.
    const mockNfts: Nft[] = [
      {
        id: '1',
        name: 'My First Stream',
        description: 'This is the recording of my first stream on UniaoLives.',
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        name: 'Gaming Highlights',
        description: 'A collection of my best gaming moments.',
        image: 'https://via.placeholder.com/150',
      },
    ];
    setNfts(mockNfts);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading NFTs...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Stream NFTs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <div key={nft.id} className="border rounded-lg p-4">
            <img src={nft.image} alt={nft.name} className="w-full h-auto rounded-md mb-2" />
            <h3 className="font-bold">{nft.name}</h3>
            <p className="text-sm text-gray-500">{nft.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NftGallery;
