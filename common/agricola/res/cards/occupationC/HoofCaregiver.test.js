const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hoof Caregiver (C156)', () => {
  test('adds cattle to market and gives grain plus food based on cattle count', () => {
    const card = res.getCardById('hoof-caregiver-c156')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.food = 0
    game.addToAccumulationSpace = jest.fn()
    game.getAccumulatedResources = () => ({ cattle: 3 })
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.addToAccumulationSpace).toHaveBeenCalledWith('take-cattle', 'cattle', 1)
    expect(dennis.grain).toBe(1)
    expect(dennis.food).toBe(3)
  })

  test('handles case with no cattle on market', () => {
    const card = res.getCardById('hoof-caregiver-c156')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.food = 0
    game.addToAccumulationSpace = jest.fn()
    game.getAccumulatedResources = () => ({})
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
    expect(dennis.food).toBe(0)
  })
})
