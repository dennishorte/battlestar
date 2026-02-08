const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Riverine Shepherd (OccA 137)', () => {
  test('takes 1 reed from reed bank when using sheep market', () => {
    const card = res.getCardById('riverine-shepherd-a137')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.getAccumulatedResources = () => ({ reed: 3 })
    game.removeFromAccumulationSpace = jest.fn()

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.reed).toBe(1)
    expect(game.removeFromAccumulationSpace).toHaveBeenCalledWith('take-reed', 'reed', 1)
  })

  test('does not take reed when reed bank is empty', () => {
    const card = res.getCardById('riverine-shepherd-a137')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.getAccumulatedResources = () => ({ reed: 0 })
    game.removeFromAccumulationSpace = jest.fn()

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.reed).toBe(0)
    expect(game.removeFromAccumulationSpace).not.toHaveBeenCalled()
  })

  test('takes 1 sheep from sheep market when using reed bank', () => {
    const card = res.getCardById('riverine-shepherd-a137')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.getAccumulatedResources = () => ({ sheep: 2 })
    game.removeFromAccumulationSpace = jest.fn()
    dennis.addAnimals = jest.fn()

    card.onAction(game, dennis, 'take-reed')

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 1)
    expect(game.removeFromAccumulationSpace).toHaveBeenCalledWith('take-sheep', 'sheep', 1)
  })

  test('does not take sheep when sheep market is empty', () => {
    const card = res.getCardById('riverine-shepherd-a137')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.getAccumulatedResources = () => ({ sheep: 0 })
    game.removeFromAccumulationSpace = jest.fn()
    dennis.addAnimals = jest.fn()

    card.onAction(game, dennis, 'take-reed')

    expect(dennis.addAnimals).not.toHaveBeenCalled()
    expect(game.removeFromAccumulationSpace).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('riverine-shepherd-a137')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.getAccumulatedResources = jest.fn()
    game.removeFromAccumulationSpace = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.getAccumulatedResources).not.toHaveBeenCalled()
    expect(dennis.reed).toBe(0)
  })
})
