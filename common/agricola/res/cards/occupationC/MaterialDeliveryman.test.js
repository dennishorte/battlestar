const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Material Deliveryman (C163)', () => {
  test('gives stone when 8+ goods taken from accumulation space', () => {
    const card = res.getCardById('material-deliveryman-c163')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.stone = 0
    game.isAccumulationSpace = () => true
    game.log = { add: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis, { wood: 8 })

    expect(dennis.stone).toBe(1)
  })

  test('gives reed when 7 goods taken from accumulation space', () => {
    const card = res.getCardById('material-deliveryman-c163')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.reed = 0
    game.isAccumulationSpace = () => true
    game.log = { add: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis, { wood: 7 })

    expect(dennis.reed).toBe(1)
  })

  test('gives clay when 6 goods taken from accumulation space', () => {
    const card = res.getCardById('material-deliveryman-c163')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.clay = 0
    game.isAccumulationSpace = () => true
    game.log = { add: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis, { wood: 6 })

    expect(dennis.clay).toBe(1)
  })

  test('gives wood when 5 goods taken from accumulation space', () => {
    const card = res.getCardById('material-deliveryman-c163')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.wood = 0
    game.isAccumulationSpace = () => true
    game.log = { add: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis, { wood: 5 })

    expect(dennis.wood).toBe(1)
  })

  test('gives nothing when less than 5 goods taken', () => {
    const card = res.getCardById('material-deliveryman-c163')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.wood = 0
    dennis.clay = 0
    dennis.reed = 0
    dennis.stone = 0
    game.isAccumulationSpace = () => true

    card.onAnyAction(game, micah, 'take-wood', dennis, { wood: 4 })

    expect(dennis.wood).toBe(0)
    expect(dennis.clay).toBe(0)
    expect(dennis.reed).toBe(0)
    expect(dennis.stone).toBe(0)
  })

  test('does not trigger for non-accumulation spaces', () => {
    const card = res.getCardById('material-deliveryman-c163')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.wood = 0
    game.isAccumulationSpace = () => false

    card.onAnyAction(game, micah, 'day-laborer', dennis, { food: 10 })

    expect(dennis.wood).toBe(0)
  })
})
