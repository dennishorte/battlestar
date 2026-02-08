const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stone Weir (E055)', () => {
  test('gives 4 bonus food when fishing space has 0 food', () => {
    const card = res.getCardById('stone-weir-e055')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ food: 0 })

    card.onAction(game, dennis, 'fishing')

    expect(dennis.food).toBe(4)
  })

  test('gives 3 bonus food when fishing space has 1 food', () => {
    const card = res.getCardById('stone-weir-e055')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ food: 1 })

    card.onAction(game, dennis, 'fishing')

    expect(dennis.food).toBe(3)
  })

  test('gives 2 bonus food when fishing space has 2 food', () => {
    const card = res.getCardById('stone-weir-e055')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ food: 2 })

    card.onAction(game, dennis, 'fishing')

    expect(dennis.food).toBe(2)
  })

  test('gives 1 bonus food when fishing space has 3 food', () => {
    const card = res.getCardById('stone-weir-e055')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ food: 3 })

    card.onAction(game, dennis, 'fishing')

    expect(dennis.food).toBe(1)
  })

  test('gives 0 bonus food when fishing space has 4+ food', () => {
    const card = res.getCardById('stone-weir-e055')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ food: 5 })

    card.onAction(game, dennis, 'fishing')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('stone-weir-e055')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.getAccumulatedResources = () => ({ food: 0 })

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.food).toBe(0)
  })
})
