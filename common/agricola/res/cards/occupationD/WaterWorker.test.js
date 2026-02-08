const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Water Worker (OccD 144)', () => {
  test('gives 1 reed when using fishing', () => {
    const card = res.getCardById('water-worker-d144')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.getAdjacentActionSpaces = () => []

    card.onAction(game, dennis, 'fishing')

    expect(dennis.reed).toBe(1)
  })

  test('gives 1 reed when using adjacent action space', () => {
    const card = res.getCardById('water-worker-d144')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.getAdjacentActionSpaces = () => ['adjacent-space-1', 'adjacent-space-2']

    card.onAction(game, dennis, 'adjacent-space-1')

    expect(dennis.reed).toBe(1)
  })

  test('does not give reed for non-adjacent actions', () => {
    const card = res.getCardById('water-worker-d144')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.getAdjacentActionSpaces = () => ['adjacent-space-1', 'adjacent-space-2']

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.reed).toBe(0)
  })
})
