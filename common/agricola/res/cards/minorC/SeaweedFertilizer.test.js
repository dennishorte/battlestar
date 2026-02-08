const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Seaweed Fertilizer (C073)', () => {
  test('has onSow hook', () => {
    const card = res.getCardById('seaweed-fertilizer-c073')
    expect(card.onSow).toBeDefined()
  })

  test('gives grain before round 11', () => {
    const card = res.getCardById('seaweed-fertilizer-c073')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.state.round = 5

    card.onSow(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('offers choice from round 11 on', () => {
    const card = res.getCardById('seaweed-fertilizer-c073')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 11
    let actionCalled = false

    game.actions.offerSeaweedFertilizer = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onSow(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('offers choice at round 14', () => {
    const card = res.getCardById('seaweed-fertilizer-c073')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 14
    let actionCalled = false

    game.actions.offerSeaweedFertilizer = (_player, _cardArg) => {
      actionCalled = true
    }

    card.onSow(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
