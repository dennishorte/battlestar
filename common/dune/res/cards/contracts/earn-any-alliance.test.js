const card = require('./earn-any-alliance.js')

describe('Earn Any Alliance (contract)', () => {
  test('data', () => {
    expect(card.id).toBe('earn-any-alliance')
    expect(card.name).toBe('Earn Any Alliance')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
  })
})
