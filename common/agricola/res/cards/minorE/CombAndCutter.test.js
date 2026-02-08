const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Comb and Cutter (E059)', () => {
  test('gives bonus food based on sheep on market', () => {
    const card = res.getCardById('comb-and-cutter-e059')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ sheep: 3 })

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.food).toBe(3)
  })

  test('caps bonus food at 4', () => {
    const card = res.getCardById('comb-and-cutter-e059')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ sheep: 7 })

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.food).toBe(4)
  })

  test('gives no bonus if no sheep on market', () => {
    const card = res.getCardById('comb-and-cutter-e059')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ sheep: 0 })

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('comb-and-cutter-e059')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ sheep: 5 })

    card.onAction(game, dennis, 'forest')

    expect(dennis.food).toBe(0)
  })
})
