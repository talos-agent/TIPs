import { POST } from '../../../src/app/api/streams/route';
import { prisma } from '../../../src/lib/prisma';

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

describe('POST /api/streams', () => {
  it('should create a new stream', async () => {
    const mockUser = { id: '1', walletAddress: '0x123...', username: 'testuser' };
    const mockStream = { id: '1', streamKey: 'sk_123...', userId: '1' };

    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.stream.create.mockResolvedValue(mockStream);

    const request = new Request('http://localhost/api/streams', {
      method: 'POST',
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual(mockStream);
    expect(prisma.stream.create).toHaveBeenCalledWith({
      data: {
        streamKey: expect.any(String),
        user: {
          connect: {
            id: mockUser.id,
          },
        },
      },
    });
  });
});
