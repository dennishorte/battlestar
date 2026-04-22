const card = require('./dagger.js')

describe('Dagger', () => {
  test('data', () => {
    expect(card.id).toBe('dagger')
    expect(card.name).toBe('Dagger')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
