const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Agricultural Labourer (C120)', () => {
  test('places 8 clay on card when played', () => {
    const card = res.getCardById('agricultural-labourer-c120')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.clay).toBe(8)
  })

  test('gives clay when obtaining grain', () => {
    const card = res.getCardById('agricultural-labourer-c120')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.clay = 8
    dennis.clay = 0
    game.log = { add: jest.fn() }

    card.onObtainGrain(game, dennis, 3)

    expect(dennis.clay).toBe(3)
    expect(card.clay).toBe(5)
  })

  test('only gives clay up to amount on card', () => {
    const card = res.getCardById('agricultural-labourer-c120')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.clay = 2
    dennis.clay = 0
    game.log = { add: jest.fn() }

    card.onObtainGrain(game, dennis, 5)

    expect(dennis.clay).toBe(2)
    expect(card.clay).toBe(0)
  })

  test('does nothing when no clay on card', () => {
    const card = res.getCardById('agricultural-labourer-c120')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.clay = 0
    dennis.clay = 0

    card.onObtainGrain(game, dennis, 3)

    expect(dennis.clay).toBe(0)
  })
})
