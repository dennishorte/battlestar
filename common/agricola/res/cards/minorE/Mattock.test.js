const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mattock (E077)', () => {
  test('gives 1 clay when getting reed from action', () => {
    const card = res.getCardById('mattock-e077')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'reed-bank', { reed: 2, stone: 0 })

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when getting stone from action', () => {
    const card = res.getCardById('mattock-e077')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'quarry', { reed: 0, stone: 3 })

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when getting both reed and stone', () => {
    const card = res.getCardById('mattock-e077')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'resource-market', { reed: 1, stone: 1 })

    expect(dennis.clay).toBe(1)
  })

  test('gives no clay when getting neither reed nor stone', () => {
    const card = res.getCardById('mattock-e077')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'forest', { wood: 3, reed: 0, stone: 0 })

    expect(dennis.clay).toBe(0)
  })

  test('gives no clay when resources is null', () => {
    const card = res.getCardById('mattock-e077')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'day-laborer', null)

    expect(dennis.clay).toBe(0)
  })
})
