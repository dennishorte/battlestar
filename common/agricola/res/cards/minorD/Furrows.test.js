const res = require('../../index.js')

describe('Furrows (D003)', () => {
  test('costs nothing and has onPlay hook', () => {
    const card = res.getCardById('furrows-d003')
    expect(card.onPlay).toBeDefined()
    expect(card.cost).toEqual({})
  })
})
