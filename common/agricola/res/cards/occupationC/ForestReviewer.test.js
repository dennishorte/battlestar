const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forest Reviewer (C145)', () => {
  test('gives reed when using copse while take-wood is occupied', () => {
    const card = res.getCardById('forest-reviewer-c145')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.reed = 0
    game.isActionOccupied = (actionId) => actionId === 'take-wood'
    game.log = { add: jest.fn() }

    card.onAnyAction(game, micah, 'copse', dennis)

    expect(dennis.reed).toBe(1)
  })

  test('gives reed when using take-wood while copse is occupied', () => {
    const card = res.getCardById('forest-reviewer-c145')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.reed = 0
    game.isActionOccupied = (actionId) => actionId === 'copse'
    game.log = { add: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.reed).toBe(1)
  })

  test('does not give reed when copse is used and take-wood is not occupied', () => {
    const card = res.getCardById('forest-reviewer-c145')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.reed = 0
    game.isActionOccupied = () => false

    card.onAnyAction(game, micah, 'copse', dennis)

    expect(dennis.reed).toBe(0)
  })

  test('does not give reed for unrelated actions', () => {
    const card = res.getCardById('forest-reviewer-c145')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.reed = 0
    game.isActionOccupied = () => true

    card.onAnyAction(game, micah, 'take-clay', dennis)

    expect(dennis.reed).toBe(0)
  })
})
