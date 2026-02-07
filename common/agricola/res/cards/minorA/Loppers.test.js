const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Loppers (A034)', () => {
  test('offers exchange when building fences with wood and fences in supply', () => {
    const card = res.getCardById('loppers-a034')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.getFencesInSupply = () => 2

    let offerCalled = false
    game.actions.offerLoppers = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onBuildFences(game, dennis)

    expect(offerCalled).toBe(true)
  })

  test('does not offer when no wood', () => {
    const card = res.getCardById('loppers-a034')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getFencesInSupply = () => 2

    let offerCalled = false
    game.actions.offerLoppers = () => {
      offerCalled = true
    }

    card.onBuildFences(game, dennis)

    expect(offerCalled).toBe(false)
  })

  test('does not offer when no fences in supply', () => {
    const card = res.getCardById('loppers-a034')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.getFencesInSupply = () => 0

    let offerCalled = false
    game.actions.offerLoppers = () => {
      offerCalled = true
    }

    card.onBuildFences(game, dennis)

    expect(offerCalled).toBe(false)
  })
})
