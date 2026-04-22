const card = require('./face-dancer-initiate.js')

describe('Face Dancer Initiate', () => {
  test('data', () => {
    expect(card.id).toBe('face-dancer-initiate')
    expect(card.name).toBe('Face Dancer Initiate')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
