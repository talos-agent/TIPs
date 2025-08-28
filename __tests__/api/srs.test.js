import { POST } from '../../../src/app/api/srs/route';
import { prisma } from '../../../src/lib/prisma';

jest.mock('../../../src/lib/prisma', () => ({
  prisma: {
    stream: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('POST /api/srs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle on_publish webhook and approve a valid stream', async () => {
    const mockStream = { id: '1', streamKey: 'sk_123...' };
    prisma.stream.findUnique.mockResolvedValue(mockStream);

    const request = new Request('http://localhost/api/srs', {
      method: 'POST',
      body: JSON.stringify({ action: 'on_publish', param: '?token=sk_123...' }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.code).toBe(0);
    expect(prisma.stream.update).toHaveBeenCalledWith({
      where: { streamKey: 'sk_123...' },
      data: { isLive: true },
    });
  });

  it('should handle on_unpublish webhook', async () => {
    const request = new Request('http://localhost/api/srs', {
        method: 'POST',
        body: JSON.stringify({ action: 'on_unpublish', param: '?token=sk_123...' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(prisma.stream.update).toHaveBeenCalledWith({
        where: { streamKey: 'sk_123...' },
        data: { isLive: false },
    });
  });

  it('should handle on_play webhook', async () => {
    const request = new Request('http://localhost/api/srs', {
        method: 'POST',
        body: JSON.stringify({ action: 'on_play', param: '?token=sk_123...' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(prisma.stream.update).toHaveBeenCalledWith({
        where: { streamKey: 'sk_123...' },
        data: { viewerCount: { increment: 1 } },
    });
  });

  it('should handle on_stop webhook', async () => {
    const request = new Request('http://localhost/api/srs', {
        method: 'POST',
        body: JSON.stringify({ action: 'on_stop', param: '?token=sk_123...' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(prisma.stream.update).toHaveBeenCalledWith({
        where: { streamKey: 'sk_123...' },
        data: { viewerCount: { decrement: 1 } },
    });
  });
});
