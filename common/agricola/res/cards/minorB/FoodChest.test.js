const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Food Chest (B059)', () => {
  test('gives 4 food when played on major-improvement', () => {
    const card = res.getCardById('food-chest-b059')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis, 'major-improvement')

    expect(dennis.food).toBe(4)
  })

  test('gives 2 food when played on other action space', () => {
    const card = res.getCardById('food-chest-b059')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis, 'meeting-place')

    expect(dennis.food).toBe(2)
  })

  test('gives 2 food when played on lessons', () => {
    const card = res.getCardById('food-chest-b059')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis, 'lessons')

    expect(dennis.food).toBe(2)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('food-chest-b059')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
