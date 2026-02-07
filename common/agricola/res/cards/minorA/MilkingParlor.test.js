const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Milking Parlor (A057)', () => {
  test('gives food based on sheep count', () => {
    const card = res.getCardById('milking-parlor-a057')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getTotalAnimals = (type) => type === 'sheep' ? 3 : 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(3)
  })

  test('gives 4 food for 4+ sheep', () => {
    const card = res.getCardById('milking-parlor-a057')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getTotalAnimals = (type) => type === 'sheep' ? 5 : 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(4)
  })

  test('gives food based on cattle count', () => {
    const card = res.getCardById('milking-parlor-a057')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getTotalAnimals = (type) => type === 'cattle' ? 2 : 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(3)
  })

  test('gives combined food for sheep and cattle', () => {
    const card = res.getCardById('milking-parlor-a057')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getTotalAnimals = (type) => {
      if (type === 'sheep') {
        return 4
      }
      if (type === 'cattle') {
        return 3
      }
      return 0
    }

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(8) // 4 for sheep + 4 for cattle
  })

  test('gives no food when no animals', () => {
    const card = res.getCardById('milking-parlor-a057')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getTotalAnimals = () => 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(0)
  })
})
