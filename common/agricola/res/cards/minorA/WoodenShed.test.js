const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wooden Shed (A010)', () => {
  test('provides room', () => {
    const card = res.getCardById('wooden-shed-a010')
    expect(card.providesRoom).toBe(true)
  })

  test('requires major improvement action', () => {
    const card = res.getCardById('wooden-shed-a010')
    expect(card.requiresMajorImprovementAction).toBe(true)
  })

  test('prevents renovation on play', () => {
    const card = res.getCardById('wooden-shed-a010')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.cannotRenovate).toBe(true)
  })

  test('has correct cost', () => {
    const card = res.getCardById('wooden-shed-a010')
    expect(card.cost).toEqual({ wood: 2, reed: 1 })
    expect(card.vps).toBe(0)
  })
})
