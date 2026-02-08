const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Ravenous Hunger (C042)', () => {
  test('has onAction hook', () => {
    const card = res.getCardById('ravenous-hunger-c042')
    expect(card.onAction).toBeDefined()
  })

  test('offers effect on take-vegetable action', () => {
    const card = res.getCardById('ravenous-hunger-c042')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.offerRavenousHunger = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onAction(game, dennis, 'take-vegetable')

    expect(actionCalled).toBe(true)
  })

  test('does not trigger on other actions', () => {
    const card = res.getCardById('ravenous-hunger-c042')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.offerRavenousHunger = () => {
      actionCalled = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(actionCalled).toBe(false)
  })
})
