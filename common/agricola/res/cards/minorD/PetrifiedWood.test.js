const res = require('../../index.js')

describe('Petrified Wood (D006)', () => {
  test('has onPlay hook for exchange', () => {
    const card = res.getCardById('petrified-wood-d006')
    expect(card.onPlay).toBeDefined()
    expect(card.cost).toEqual({})
    expect(card.prereqs).toEqual({ occupations: 2 })
  })
})
