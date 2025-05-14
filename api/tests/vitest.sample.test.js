import { describe, it, expect } from 'vitest';
import { createUser, createGame } from './fixtures/db.vitest.js';

describe('Sample Vitest Test', () => {
  it('should correctly create a test user', async () => {
    const testUser = await createUser({
      name: 'vitest-user',
      email: 'vitest@example.com'
    });
    
    expect(testUser).toBeDefined();
    expect(testUser._id).toBeDefined();
    expect(testUser.name).toBe('vitest-user');
    expect(testUser.email).toBe('vitest@example.com');
  });
  
  it('should correctly create a test game', async () => {
    const testGame = await createGame({
      name: 'Vitest Game',
      status: 'pending'
    });
    
    expect(testGame).toBeDefined();
    expect(testGame._id).toBeDefined();
    expect(testGame.name).toBe('Vitest Game');
    expect(testGame.status).toBe('pending');
    expect(testGame.createdAt).toBeInstanceOf(Date);
  });
  
  it('should perform basic assertions', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toMatch(/^hel/);
    expect([1, 2, 3]).toContain(2);
  });
}); 