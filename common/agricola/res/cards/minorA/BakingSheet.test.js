const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Baking Sheet (A030)', () => {
  test('offers baking sheet exchange when player has grain', () => {
    const card = res.getCardById('baking-sheet-a030')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1

    let offerCalled = false
    game.actions.offerBakingSheet = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onBake(game, dennis)

    expect(offerCalled).toBe(true)
  })

  test('does not offer exchange when player has no grain', () => {
    const card = res.getCardById('baking-sheet-a030')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    let offerCalled = false
    game.actions.offerBakingSheet = () => {
      offerCalled = true
    }

    card.onBake(game, dennis)

    expect(offerCalled).toBe(false)
  })
})
