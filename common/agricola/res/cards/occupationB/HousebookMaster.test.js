const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Housebook Master (B134)', () => {
  test('gives 3 food and 3 bonus points when renovating to stone in round 11 or before', () => {
    const card = res.getCardById('housebook-master-b134')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 10

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onRenovate(game, dennis, 'clay', 'stone')

    expect(dennis.food).toBe(3)
    expect(dennis.bonusPoints).toBe(3)
  })

  test('gives 2 food and 2 bonus points when renovating to stone in round 12', () => {
    const card = res.getCardById('housebook-master-b134')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 12

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onRenovate(game, dennis, 'clay', 'stone')

    expect(dennis.food).toBe(2)
    expect(dennis.bonusPoints).toBe(2)
  })

  test('gives 1 food and 1 bonus point when renovating to stone in round 13', () => {
    const card = res.getCardById('housebook-master-b134')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 13

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onRenovate(game, dennis, 'clay', 'stone')

    expect(dennis.food).toBe(1)
    expect(dennis.bonusPoints).toBe(1)
  })

  test('gives no bonus when renovating to stone in round 14', () => {
    const card = res.getCardById('housebook-master-b134')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 14

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onRenovate(game, dennis, 'clay', 'stone')

    expect(dennis.food).toBe(0)
    expect(dennis.bonusPoints).toBe(0)
  })

  test('does not trigger when renovating to clay', () => {
    const card = res.getCardById('housebook-master-b134')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 10

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onRenovate(game, dennis, 'wood', 'clay')

    expect(dennis.food).toBe(0)
    expect(dennis.bonusPoints).toBe(0)
  })
})
