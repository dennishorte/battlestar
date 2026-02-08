const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Plant Fertilizer (C008)', () => {
  test('has onPlay hook that calls plantFertilizerEffect', () => {
    const card = res.getCardById('plant-fertilizer-c008')
    expect(card.onPlay).toBeDefined()
  })

  test('calls plantFertilizerEffect action on play', () => {
    const card = res.getCardById('plant-fertilizer-c008')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.plantFertilizerEffect = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('has no cost', () => {
    const card = res.getCardById('plant-fertilizer-c008')
    expect(card.cost).toEqual({})
  })
})
