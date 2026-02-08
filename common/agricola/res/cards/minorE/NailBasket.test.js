const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Nail Basket (E015)', () => {
  test('offers fence building after using forest action with stone', () => {
    const card = res.getCardById('nail-basket-e015')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 2

    let offerMade = false
    game.actions.offerNailBasket = (player, sourceCard, actionId) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(actionId).toBe('forest')
    }

    card.onAction(game, dennis, 'forest')

    expect(offerMade).toBe(true)
  })

  test('offers fence building for grove action', () => {
    const card = res.getCardById('nail-basket-e015')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 1

    let offerMade = false
    game.actions.offerNailBasket = (player, sourceCard, actionId) => {
      offerMade = true
      expect(actionId).toBe('grove')
    }

    card.onAction(game, dennis, 'grove')

    expect(offerMade).toBe(true)
  })

  test('offers fence building for copse action', () => {
    const card = res.getCardById('nail-basket-e015')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 1

    let offerMade = false
    game.actions.offerNailBasket = (player, sourceCard, actionId) => {
      offerMade = true
      expect(actionId).toBe('copse')
    }

    card.onAction(game, dennis, 'copse')

    expect(offerMade).toBe(true)
  })

  test('does not offer when player has no stone', () => {
    const card = res.getCardById('nail-basket-e015')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    let offerMade = false
    game.actions.offerNailBasket = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'forest')

    expect(offerMade).toBe(false)
  })

  test('does not offer for non-wood actions', () => {
    const card = res.getCardById('nail-basket-e015')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 5

    let offerMade = false
    game.actions.offerNailBasket = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'clay-pit')

    expect(offerMade).toBe(false)
  })
})
