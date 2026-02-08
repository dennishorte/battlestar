const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wood Carrier (OccA 117)', () => {
  test('gives wood equal to improvement count on play', () => {
    const card = res.getCardById('wood-carrier-a117')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getImprovementCount = () => 4

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(4)
  })

  test('gives 0 wood with no improvements', () => {
    const card = res.getCardById('wood-carrier-a117')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    dennis.getImprovementCount = () => 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(5) // Unchanged
  })

  test('gives 1 wood for 1 improvement', () => {
    const card = res.getCardById('wood-carrier-a117')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getImprovementCount = () => 1

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })
})
