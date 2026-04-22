const card = require('./sardaukar-2.js')

describe('Sardaukar (contract) [sardaukar-2]', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-2')
    expect(card.name).toBe('Sardaukar')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
