const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Loudmouth (OccD 140)', () => {
  test('gives 1 food when taking 4+ building resources', () => {
    const card = res.getCardById('loudmouth-d140')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 4 })

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(1)
  })

  test('gives 1 food when taking 4+ animals', () => {
    const card = res.getCardById('loudmouth-d140')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ sheep: 4 })

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.food).toBe(1)
  })

  test('gives 1 food when taking mixed building resources totaling 4+', () => {
    const card = res.getCardById('loudmouth-d140')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 2, clay: 2 })

    card.onAction(game, dennis, 'some-action')

    expect(dennis.food).toBe(1)
  })

  test('does not give food when taking less than 4 resources', () => {
    const card = res.getCardById('loudmouth-d140')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 3 })

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger for non-accumulation spaces', () => {
    const card = res.getCardById('loudmouth-d140')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isAccumulationSpace = () => false
    game.getAccumulatedResources = () => ({ wood: 5 })

    card.onAction(game, dennis, 'some-action')

    expect(dennis.food).toBe(0)
  })

  test('does not mix building resources and animals', () => {
    const card = res.getCardById('loudmouth-d140')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 2, sheep: 2 })

    card.onAction(game, dennis, 'some-action')

    expect(dennis.food).toBe(0)
  })
})
