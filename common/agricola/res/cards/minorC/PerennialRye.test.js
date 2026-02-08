const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Perennial Rye (C084)', () => {
  test('has onRoundEnd hook', () => {
    const card = res.getCardById('perennial-rye-c084')
    expect(card.onRoundEnd).toBeDefined()
  })

  test('offers breeding in non-harvest round when player has grain', () => {
    const card = res.getCardById('perennial-rye-c084')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    let actionCalled = false

    game.isHarvestRound = () => false

    game.actions.offerPerennialRye = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onRoundEnd(game, dennis, 5)

    expect(actionCalled).toBe(true)
  })

  test('does not offer breeding in harvest round', () => {
    const card = res.getCardById('perennial-rye-c084')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    let actionCalled = false

    game.isHarvestRound = () => true

    game.actions.offerPerennialRye = () => {
      actionCalled = true
    }

    card.onRoundEnd(game, dennis, 4)

    expect(actionCalled).toBe(false)
  })

  test('does not offer breeding when player has no grain', () => {
    const card = res.getCardById('perennial-rye-c084')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    let actionCalled = false

    game.isHarvestRound = () => false

    game.actions.offerPerennialRye = () => {
      actionCalled = true
    }

    card.onRoundEnd(game, dennis, 5)

    expect(actionCalled).toBe(false)
  })
})
