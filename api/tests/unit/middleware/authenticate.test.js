const { authenticate } = require('../../../src/middleware/auth');
const { UnauthorizedError, ForbiddenError } = require('../../../src/utils/errors');

// Mock dependencies
jest.mock('../../../src/models/db', () => ({
  user: {
    findById: jest.fn()
  }
}));

const db = require('../../../src/models/db');

describe('Authenticate Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      session: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() when user is authenticated with valid session', async () => {
    // Setup
    req.session.user = {
      _id: 'user123',
      role: 'user'
    };
    
    db.user.findById.mockResolvedValueOnce({
      _id: 'user123',
      role: 'user',
      active: true
    });

    // Execute
    await authenticate(req, res, next);

    // Verify
    expect(db.user.findById).toHaveBeenCalledWith('user123');
    expect(next).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('should throw UnauthorizedError when session has no user', async () => {
    // Setup
    req.session = {};

    // Execute
    await authenticate(req, res, next);

    // Verify
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should throw UnauthorizedError when user not found in database', async () => {
    // Setup
    req.session.user = {
      _id: 'nonexistent',
      role: 'user'
    };
    
    db.user.findById.mockResolvedValueOnce(null);

    // Execute
    await authenticate(req, res, next);

    // Verify
    expect(db.user.findById).toHaveBeenCalledWith('nonexistent');
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should throw ForbiddenError when user is inactive', async () => {
    // Setup
    req.session.user = {
      _id: 'inactive123',
      role: 'user'
    };
    
    db.user.findById.mockResolvedValueOnce({
      _id: 'inactive123',
      role: 'user',
      active: false
    });

    // Execute
    await authenticate(req, res, next);

    // Verify
    expect(db.user.findById).toHaveBeenCalledWith('inactive123');
    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it('should handle database errors', async () => {
    // Setup
    req.session.user = {
      _id: 'user123',
      role: 'user'
    };
    
    const dbError = new Error('Database error');
    db.user.findById.mockRejectedValueOnce(dbError);

    // Execute
    await authenticate(req, res, next);

    // Verify
    expect(db.user.findById).toHaveBeenCalledWith('user123');
    expect(next).toHaveBeenCalledWith(dbError);
  });
}); 