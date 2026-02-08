const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sculptor (OccD 105)', () => {
  test('gives 1 food when using take-clay', () => {
    const card = res.getCardById('sculptor-d105')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.food).toBe(1)
  })

  test('gives 1 food when using take-clay-2', () => {
    const card = res.getCardById('sculptor-d105')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'take-clay-2')

    expect(dennis.food).toBe(1)
  })

  test('gives 1 grain when using take-stone-1', () => {
    const card = res.getCardById('sculptor-d105')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onAction(game, dennis, 'take-stone-1')

    expect(dennis.grain).toBe(1)
  })

  test('gives 1 grain when using take-stone-2', () => {
    const card = res.getCardById('sculptor-d105')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onAction(game, dennis, 'take-stone-2')

    expect(dennis.grain).toBe(1)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('sculptor-d105')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.grain = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(0)
    expect(dennis.grain).toBe(0)
  })
})
