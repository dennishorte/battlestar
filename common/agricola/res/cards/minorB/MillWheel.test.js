const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mill Wheel (B064)', () => {
  test('gives 2 food when using grain utilization while fishing is occupied', () => {
    const card = res.getCardById('mill-wheel-b064')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = {
      fishing: { occupiedBy: 'micah' }
    }

    card.onAction(game, dennis, 'sow-bake')

    expect(dennis.food).toBe(2)
  })

  test('does not give food when fishing is not occupied', () => {
    const card = res.getCardById('mill-wheel-b064')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = {
      fishing: { occupiedBy: null }
    }

    card.onAction(game, dennis, 'sow-bake')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger on other actions', () => {
    const card = res.getCardById('mill-wheel-b064')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = {
      fishing: { occupiedBy: 'micah' }
    }

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(0)
  })

  test('has 1 VP', () => {
    const card = res.getCardById('mill-wheel-b064')
    expect(card.vps).toBe(1)
  })

  test('costs 2 wood', () => {
    const card = res.getCardById('mill-wheel-b064')
    expect(card.cost).toEqual({ wood: 2 })
  })
})
