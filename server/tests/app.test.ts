import request from 'supertest';
import app from '../src/app';

jest.mock('../src/prisma', () => ({
  inboxItem: {
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: '1', ...data })),
    delete: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('Inbox routes', () => {
  it('returns empty list', async () => {
    const res = await request(app).get('/api/inbox');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creates item', async () => {
    const res = await request(app).post('/api/inbox').send({ text: 'hello' });
    expect(res.status).toBe(201);
    expect(res.body.text).toBe('hello');
  });
});
