const card = require('./face-dancer.js')

describe('Face Dancer', () => {
  test('data', () => {
    expect(card.id).toBe('face-dancer')
    expect(card.name).toBe('Face Dancer')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
