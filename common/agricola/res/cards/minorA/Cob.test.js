const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cob (A076)', () => {
  test('offers exchange when player has clay and grain', () => {
    const card = res.getCardById('cob-a076')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 1
    dennis.grain = 1

    let offerCalled = false
    game.actions.offerCob = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onWorkPhaseStart(game, dennis)

    expect(offerCalled).toBe(true)
  })

  test('does not offer when player has no clay', () => {
    const card = res.getCardById('cob-a076')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.grain = 1

    let offerCalled = false
    game.actions.offerCob = () => {
      offerCalled = true
    }

    card.onWorkPhaseStart(game, dennis)

    expect(offerCalled).toBe(false)
  })

  test('does not offer when player has no grain', () => {
    const card = res.getCardById('cob-a076')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 1
    dennis.grain = 0

    let offerCalled = false
    game.actions.offerCob = () => {
      offerCalled = true
    }

    card.onWorkPhaseStart(game, dennis)

    expect(offerCalled).toBe(false)
  })
})
