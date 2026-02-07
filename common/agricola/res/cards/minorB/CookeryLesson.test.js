const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cookery Lesson (B029)', () => {
  test('gives 1 bonus point on lessons with cooking', () => {
    const card = res.getCardById('cookery-lesson-b029')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.onLessonsWithCooking(game, dennis)

    expect(dennis.bonusPoints).toBe(1)
  })

  test('accumulates bonus points', () => {
    const card = res.getCardById('cookery-lesson-b029')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 2

    card.onLessonsWithCooking(game, dennis)

    expect(dennis.bonusPoints).toBe(3)
  })

  test('costs 2 food', () => {
    const card = res.getCardById('cookery-lesson-b029')
    expect(card.cost).toEqual({ food: 2 })
  })
})
