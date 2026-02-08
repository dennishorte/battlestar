const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mineralogist (B122)', () => {
  test('gives 1 stone when using clay accumulation space', () => {
    const card = res.getCardById('mineralogist-b122')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.stone).toBe(1)
  })

  test('gives 1 stone when using Hollow (take-clay-2)', () => {
    const card = res.getCardById('mineralogist-b122')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onAction(game, dennis, 'take-clay-2')

    expect(dennis.stone).toBe(1)
  })

  test('gives 1 clay when using stone accumulation space', () => {
    const card = res.getCardById('mineralogist-b122')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'take-stone-1')

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when using take-stone-2', () => {
    const card = res.getCardById('mineralogist-b122')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'take-stone-2')

    expect(dennis.clay).toBe(1)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('mineralogist-b122')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.clay = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.stone).toBe(0)
    expect(dennis.clay).toBe(0)
  })
})
