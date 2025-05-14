import { describe, it, expect } from 'vitest';
import { createUser, createGame } from './fixtures/db.vitest.js';

describe('Parallel Vitest Test', () => {
  it('should correctly create a test user in parallel', async () => {
    const testUser = await createUser({
      name: 'parallel-user',
      email: 'parallel@example.com'
    });
    
    expect(testUser).toBeDefined();
    expect(testUser._id).toBeDefined();
    expect(testUser.name).toBe('parallel-user');
    expect(testUser.email).toBe('parallel@example.com');
  });
  
  it('should correctly create a test game in parallel', async () => {
    const testGame = await createGame({
      name: 'Parallel Game',
      status: 'completed'
    });
    
    expect(testGame).toBeDefined();
    expect(testGame._id).toBeDefined();
    expect(testGame.name).toBe('Parallel Game');
    expect(testGame.status).toBe('completed');
    expect(testGame.createdAt).toBeInstanceOf(Date);
  });
}); 