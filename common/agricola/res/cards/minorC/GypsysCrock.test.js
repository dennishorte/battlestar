const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Gypsy's Crock (C053)", () => {
  test('has onCook hook', () => {
    const card = res.getCardById('gypsys-crock-c053')
    expect(card.onCook).toBeDefined()
  })

  test('gives 1 additional food when cooking 2+ goods', () => {
    const card = res.getCardById('gypsys-crock-c053')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onCook(game, dennis, 2)

    expect(dennis.food).toBe(1)
  })

  test('gives 1 additional food when cooking 3 goods', () => {
    const card = res.getCardById('gypsys-crock-c053')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onCook(game, dennis, 3)

    expect(dennis.food).toBe(1)
  })

  test('does not give food when cooking 1 good', () => {
    const card = res.getCardById('gypsys-crock-c053')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onCook(game, dennis, 1)

    expect(dennis.food).toBe(0)
  })

  test('does not give food when cooking 0 goods', () => {
    const card = res.getCardById('gypsys-crock-c053')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onCook(game, dennis, 0)

    expect(dennis.food).toBe(0)
  })
})
