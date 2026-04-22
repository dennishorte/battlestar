const card = require('./convincing-argument.js')

describe('Convincing Argument', () => {
  test('data', () => {
    expect(card.id).toBe('convincing-argument')
    expect(card.name).toBe('Convincing Argument')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
