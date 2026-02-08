const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Firewood Collector (OccA 119)', () => {
  test('gives 1 wood when using plow-field', () => {
    const card = res.getCardById('firewood-collector-a119')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'plow-field')

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 wood when using take-grain', () => {
    const card = res.getCardById('firewood-collector-a119')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'take-grain')

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 wood when using sow-bake', () => {
    const card = res.getCardById('firewood-collector-a119')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'sow-bake')

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 wood when using plow-sow', () => {
    const card = res.getCardById('firewood-collector-a119')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'plow-sow')

    expect(dennis.wood).toBe(1)
  })

  test('does not give wood for other actions', () => {
    const card = res.getCardById('firewood-collector-a119')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(0)
  })
})
