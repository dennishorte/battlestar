const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sowing Master (OccD 109)', () => {
  test('gives 1 wood on play', () => {
    const card = res.getCardById('sowing-master-d109')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('gives 2 food when using plow-sow', () => {
    const card = res.getCardById('sowing-master-d109')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'plow-sow')

    expect(dennis.food).toBe(2)
  })

  test('gives 2 food when using sow-bake', () => {
    const card = res.getCardById('sowing-master-d109')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'sow-bake')

    expect(dennis.food).toBe(2)
  })

  test('does not give food for other actions', () => {
    const card = res.getCardById('sowing-master-d109')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(0)
  })
})
