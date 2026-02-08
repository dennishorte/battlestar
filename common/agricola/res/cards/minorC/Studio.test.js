const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Studio (C055)', () => {
  test('has onFeedingPhase hook', () => {
    const card = res.getCardById('studio-c055')
    expect(card.onFeedingPhase).toBeDefined()
  })

  test('offers studio effect when player has wood', () => {
    const card = res.getCardById('studio-c055')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.clay = 0
    dennis.stone = 0
    let actionCalled = false

    game.actions.offerStudio = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onFeedingPhase(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('offers studio effect when player has clay', () => {
    const card = res.getCardById('studio-c055')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 1
    dennis.stone = 0
    let actionCalled = false

    game.actions.offerStudio = (_player, _cardArg) => {
      actionCalled = true
    }

    card.onFeedingPhase(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('offers studio effect when player has stone', () => {
    const card = res.getCardById('studio-c055')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0
    dennis.stone = 1
    let actionCalled = false

    game.actions.offerStudio = (_player, _cardArg) => {
      actionCalled = true
    }

    card.onFeedingPhase(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('does not offer effect when player has no building resources', () => {
    const card = res.getCardById('studio-c055')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0
    dennis.stone = 0
    let actionCalled = false

    game.actions.offerStudio = () => {
      actionCalled = true
    }

    card.onFeedingPhase(game, dennis)

    expect(actionCalled).toBe(false)
  })
})
