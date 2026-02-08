const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tree Cutter (OccD 143)', () => {
  test('gives 1 wood when taking 3+ of same resource except wood', () => {
    const card = res.getCardById('tree-cutter-d143')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ clay: 3 })

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 wood when taking 3+ food', () => {
    const card = res.getCardById('tree-cutter-d143')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ food: 4 })

    card.onAction(game, dennis, 'fishing')

    expect(dennis.wood).toBe(1)
  })

  test('does not give wood when taking 3+ wood', () => {
    const card = res.getCardById('tree-cutter-d143')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 5 })

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(0)
  })

  test('does not give wood when taking less than 3 of a resource', () => {
    const card = res.getCardById('tree-cutter-d143')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ clay: 2 })

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.wood).toBe(0)
  })

  test('does not trigger for non-accumulation spaces', () => {
    const card = res.getCardById('tree-cutter-d143')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.isAccumulationSpace = () => false
    game.getAccumulatedResources = () => ({ clay: 5 })

    card.onAction(game, dennis, 'some-action')

    expect(dennis.wood).toBe(0)
  })
})
