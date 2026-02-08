const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Porter (OccD 146)', () => {
  test('gives 1 extra resource and 1 food when taking 4+ of same building resource', () => {
    const card = res.getCardById('porter-d146')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 4 })

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(1)
    expect(dennis.food).toBe(1)
  })

  test('gives bonus for stone', () => {
    const card = res.getCardById('porter-d146')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ stone: 5 })

    card.onAction(game, dennis, 'take-stone-1')

    expect(dennis.stone).toBe(1)
    expect(dennis.food).toBe(1)
  })

  test('does not give bonus for less than 4 resources', () => {
    const card = res.getCardById('porter-d146')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 3 })

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(0)
    expect(dennis.food).toBe(0)
  })

  test('does not give bonus for animals', () => {
    const card = res.getCardById('porter-d146')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ sheep: 5 })

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger for non-accumulation spaces', () => {
    const card = res.getCardById('porter-d146')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 0
    game.isAccumulationSpace = () => false
    game.getAccumulatedResources = () => ({ wood: 5 })

    card.onAction(game, dennis, 'some-action')

    expect(dennis.wood).toBe(0)
    expect(dennis.food).toBe(0)
  })
})
