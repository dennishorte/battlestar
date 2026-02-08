const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Deposit (C036)', () => {
  test('has onAction hook', () => {
    const card = res.getCardById('clay-deposit-c036')
    expect(card.onAction).toBeDefined()
  })

  test('offers clay deposit on take-clay action when player has clay', () => {
    const card = res.getCardById('clay-deposit-c036')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 3
    let actionCalled = false

    game.actions.offerClayDeposit = (player, cardArg, actionId) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
      expect(actionId).toBe('take-clay')
    }

    card.onAction(game, dennis, 'take-clay')

    expect(actionCalled).toBe(true)
  })

  test('offers clay deposit on take-clay-2 action when player has clay', () => {
    const card = res.getCardById('clay-deposit-c036')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 1
    let actionCalled = false

    game.actions.offerClayDeposit = (player, cardArg, actionId) => {
      actionCalled = true
      expect(actionId).toBe('take-clay-2')
    }

    card.onAction(game, dennis, 'take-clay-2')

    expect(actionCalled).toBe(true)
  })

  test('does not offer effect when player has no clay', () => {
    const card = res.getCardById('clay-deposit-c036')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    let actionCalled = false

    game.actions.offerClayDeposit = () => {
      actionCalled = true
    }

    card.onAction(game, dennis, 'take-clay')

    expect(actionCalled).toBe(false)
  })

  test('does not trigger on non-clay actions', () => {
    const card = res.getCardById('clay-deposit-c036')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 5
    let actionCalled = false

    game.actions.offerClayDeposit = () => {
      actionCalled = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(actionCalled).toBe(false)
  })
})
