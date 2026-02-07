const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Shelter (A001)', () => {
  test('offers free stable in single space pasture on play', () => {
    const card = res.getCardById('shelter-a001')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.farmyard.pastures = [
      { spaces: [{ row: 1, col: 0 }] },
    ]
    dennis.hasStableAt = () => false

    let offerCalled = false
    game.actions.offerBuildFreeStableInSinglePasture = (player, sourceCard, pastures) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(pastures.length).toBe(1)
    }

    card.onPlay(game, dennis)

    expect(offerCalled).toBe(true)
  })

  test('does not offer when no single space pastures', () => {
    const card = res.getCardById('shelter-a001')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.farmyard.pastures = [
      { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }] },
    ]
    dennis.hasStableAt = () => false

    let offerCalled = false
    game.actions.offerBuildFreeStableInSinglePasture = () => {
      offerCalled = true
    }

    card.onPlay(game, dennis)

    expect(offerCalled).toBe(false)
  })

  test('does not offer when pasture already has stable', () => {
    const card = res.getCardById('shelter-a001')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.farmyard.pastures = [
      { spaces: [{ row: 1, col: 0 }] },
    ]
    dennis.hasStableAt = () => true

    let offerCalled = false
    game.actions.offerBuildFreeStableInSinglePasture = () => {
      offerCalled = true
    }

    card.onPlay(game, dennis)

    expect(offerCalled).toBe(false)
  })
})
