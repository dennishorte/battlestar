const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forest Clearer (B162)', () => {
  test('gives 1 wood and 1 food when obtaining exactly 2 wood', () => {
    const card = res.getCardById('forest-clearer-b162')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood', { wood: 2 })

    expect(dennis.wood).toBe(1)
    expect(dennis.food).toBe(1)
  })

  test('gives 1 wood only when obtaining exactly 3 wood', () => {
    const card = res.getCardById('forest-clearer-b162')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood', { wood: 3 })

    expect(dennis.wood).toBe(1)
    expect(dennis.food).toBe(0)
  })

  test('gives 1 wood and 1 food when obtaining exactly 4 wood', () => {
    const card = res.getCardById('forest-clearer-b162')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood', { wood: 4 })

    expect(dennis.wood).toBe(1)
    expect(dennis.food).toBe(1)
  })

  test('does not give bonus for other wood amounts', () => {
    const card = res.getCardById('forest-clearer-b162')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood', { wood: 5 })

    expect(dennis.wood).toBe(0)
    expect(dennis.food).toBe(0)
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('forest-clearer-b162')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 0

    card.onAction(game, dennis, 'take-clay', { wood: 2 })

    expect(dennis.wood).toBe(0)
    expect(dennis.food).toBe(0)
  })
})
