const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pitchfork (B062)', () => {
  test('gives 3 food when using grain seeds while farmland is occupied', () => {
    const card = res.getCardById('pitchfork-b062')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = {
      'plow-field': { occupiedBy: 'micah' }
    }

    card.onAction(game, dennis, 'take-grain')

    expect(dennis.food).toBe(3)
  })

  test('does not give food when farmland is not occupied', () => {
    const card = res.getCardById('pitchfork-b062')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = {
      'plow-field': { occupiedBy: null }
    }

    card.onAction(game, dennis, 'take-grain')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger on other actions', () => {
    const card = res.getCardById('pitchfork-b062')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = {
      'plow-field': { occupiedBy: 'micah' }
    }

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(0)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('pitchfork-b062')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
