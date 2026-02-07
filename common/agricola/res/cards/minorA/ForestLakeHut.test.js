const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forest Lake Hut (A042)', () => {
  test('gives 1 wood on Fishing action', () => {
    const card = res.getCardById('forest-lake-hut-a042')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'fishing')

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 food on Forest action', () => {
    const card = res.getCardById('forest-lake-hut-a042')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(1)
  })
})
