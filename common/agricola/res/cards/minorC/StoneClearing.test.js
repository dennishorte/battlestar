const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stone Clearing (C006)', () => {
  test('has onPlay hook that calls stoneClearingEffect', () => {
    const card = res.getCardById('stone-clearing-c006')
    expect(card.onPlay).toBeDefined()
  })

  test('calls stoneClearingEffect action on play', () => {
    const card = res.getCardById('stone-clearing-c006')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.stoneClearingEffect = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('costs 1 food', () => {
    const card = res.getCardById('stone-clearing-c006')
    expect(card.cost.food).toBe(1)
  })
})
