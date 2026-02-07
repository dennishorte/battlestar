const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bucksaw (A037)', () => {
  test('offers bucksaw exchange on renovate when player has wood', () => {
    const card = res.getCardById('bucksaw-a037')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 2

    let offerCalled = false
    game.actions.offerBucksaw = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onRenovate(game, dennis)

    expect(offerCalled).toBe(true)
  })

  test('does not offer when player has no wood', () => {
    const card = res.getCardById('bucksaw-a037')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    let offerCalled = false
    game.actions.offerBucksaw = () => {
      offerCalled = true
    }

    card.onRenovate(game, dennis)

    expect(offerCalled).toBe(false)
  })
})
