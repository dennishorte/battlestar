const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Puncher (OccA 121)', () => {
  test('gives 1 clay on play', () => {
    const card = res.getCardById('clay-puncher-a121')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when using lessons-1', () => {
    const card = res.getCardById('clay-puncher-a121')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'lessons-1')

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when using lessons-2', () => {
    const card = res.getCardById('clay-puncher-a121')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'lessons-2')

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when using take-clay', () => {
    const card = res.getCardById('clay-puncher-a121')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.clay).toBe(1)
  })

  test('does not give clay for other actions', () => {
    const card = res.getCardById('clay-puncher-a121')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.clay).toBe(0)
  })
})
