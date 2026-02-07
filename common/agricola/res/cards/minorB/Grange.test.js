const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Grange (B037)', () => {
  test('gives 1 food on play', () => {
    const card = res.getCardById('grange-b037')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
  })

  test('has 3 VPs', () => {
    const card = res.getCardById('grange-b037')
    expect(card.vps).toBe(3)
  })

  test('requires 6 fields and all animal types', () => {
    const card = res.getCardById('grange-b037')
    expect(card.prereqs.fields).toBe(6)
    expect(card.prereqs.allAnimalTypes).toBe(true)
  })

  test('has no cost', () => {
    const card = res.getCardById('grange-b037')
    expect(card.cost).toEqual({})
  })
})
