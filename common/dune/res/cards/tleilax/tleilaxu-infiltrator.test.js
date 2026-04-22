const card = require('./tleilaxu-infiltrator.js')

describe('Tleilaxu Infiltrator', () => {
  test('data', () => {
    expect(card.id).toBe('tleilaxu-infiltrator')
    expect(card.name).toBe('Tleilaxu Infiltrator')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
