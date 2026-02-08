const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cheese Fondue (E057)', () => {
  test('gives 1 bonus food when baking with sheep', () => {
    const card = res.getCardById('cheese-fondue-e057')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalCount = (type) => {
      if (type === 'sheep') {
        return 2
      }
      return 0
    }

    card.onBake(game, dennis, 2)

    expect(dennis.food).toBe(1)
  })

  test('gives 1 bonus food when baking with cattle', () => {
    const card = res.getCardById('cheese-fondue-e057')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalCount = (type) => {
      if (type === 'cattle') {
        return 1
      }
      return 0
    }

    card.onBake(game, dennis, 1)

    expect(dennis.food).toBe(1)
  })

  test('gives 2 bonus food when baking with both sheep and cattle', () => {
    const card = res.getCardById('cheese-fondue-e057')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalCount = (type) => {
      if (type === 'sheep') {
        return 3
      }
      if (type === 'cattle') {
        return 2
      }
      return 0
    }

    card.onBake(game, dennis, 3)

    expect(dennis.food).toBe(2)
  })

  test('gives no bonus food when baking 0 grain', () => {
    const card = res.getCardById('cheese-fondue-e057')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalCount = () => 5

    card.onBake(game, dennis, 0)

    expect(dennis.food).toBe(0)
  })

  test('gives no bonus food when no animals', () => {
    const card = res.getCardById('cheese-fondue-e057')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalCount = () => 0

    card.onBake(game, dennis, 2)

    expect(dennis.food).toBe(0)
  })
})
