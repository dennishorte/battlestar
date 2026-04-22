const card = require('./sardaukar-1.js')

describe('Sardaukar (contract) [sardaukar-1]', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-1')
    expect(card.name).toBe('Sardaukar')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
