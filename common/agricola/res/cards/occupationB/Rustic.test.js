const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Rustic (B111)', () => {
  test('gives 2 food and 1 bonus point when building a clay room', () => {
    const card = res.getCardById('rustic-b111')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onBuildRoom(game, dennis, 'clay', false)

    expect(dennis.food).toBe(2)
    expect(dennis.bonusPoints).toBe(1)
  })

  test('does not trigger for stone rooms', () => {
    const card = res.getCardById('rustic-b111')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onBuildRoom(game, dennis, 'stone', false)

    expect(dennis.food).toBe(0)
    expect(dennis.bonusPoints).toBe(0)
  })

  test('does not trigger for renovated rooms', () => {
    const card = res.getCardById('rustic-b111')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onBuildRoom(game, dennis, 'clay', true)

    expect(dennis.food).toBe(0)
    expect(dennis.bonusPoints).toBe(0)
  })

  test('does not trigger for wood rooms', () => {
    const card = res.getCardById('rustic-b111')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.bonusPoints = 0

    card.onBuildRoom(game, dennis, 'wood', false)

    expect(dennis.food).toBe(0)
    expect(dennis.bonusPoints).toBe(0)
  })
})
