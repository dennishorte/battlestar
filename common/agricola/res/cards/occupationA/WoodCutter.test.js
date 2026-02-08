const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wood Cutter (OccA 116)', () => {
  test('gives 1 additional wood when using take-wood', () => {
    const card = res.getCardById('wood-cutter-a116')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 additional wood when using copse', () => {
    const card = res.getCardById('wood-cutter-a116')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'copse')

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 additional wood when using take-3-wood', () => {
    const card = res.getCardById('wood-cutter-a116')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'take-3-wood')

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 additional wood when using take-2-wood', () => {
    const card = res.getCardById('wood-cutter-a116')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'take-2-wood')

    expect(dennis.wood).toBe(1)
  })

  test('does not give wood for non-wood actions', () => {
    const card = res.getCardById('wood-cutter-a116')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.wood).toBe(0)
  })
})
