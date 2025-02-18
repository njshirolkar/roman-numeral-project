import request from 'supertest';
import { Server } from 'http';
import app from '../src/server';

let server: Server;

beforeAll((done) => {
  server = app.listen(8081, done); // use a different port for testing
});

afterAll((done) => {
  server.close(done);
});

describe('Health endpoint', () => {
  it('should return OK', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });
});