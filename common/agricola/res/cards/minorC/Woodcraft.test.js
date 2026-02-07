const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Woodcraft (C058)', () => {
  test('gives 1 food when wood <= 5 after taking wood', () => {
    const card = res.getCardById('woodcraft-c058')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(1)
  })

  test('does not give food when wood > 5', () => {
    const card = res.getCardById('woodcraft-c058')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 8
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(0)
  })
})
