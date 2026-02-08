const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Kneader (C121)', () => {
  test('gives 1 wood and 2 clay on play', () => {
    const card = res.getCardById('clay-kneader-c121')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(dennis.clay).toBe(2)
  })

  test('gives 1 clay when using take-grain action', () => {
    const card = res.getCardById('clay-kneader-c121')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    game.log = { add: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when using take-vegetables action', () => {
    const card = res.getCardById('clay-kneader-c121')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    game.log = { add: jest.fn() }

    card.onAction(game, dennis, 'take-vegetables')

    expect(dennis.clay).toBe(1)
  })

  test('does not give clay for other actions', () => {
    const card = res.getCardById('clay-kneader-c121')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.clay).toBe(0)
  })
})
