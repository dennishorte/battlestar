const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Grain Depot (B065)', () => {
  test('schedules 2 grain when paid with wood', () => {
    const card = res.getCardById('grain-depot-b065')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onPlay(game, dennis, 'wood')

    expect(game.state.scheduledGrain[dennis.name][6]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][7]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][8]).toBeUndefined()
  })

  test('schedules 3 grain when paid with clay', () => {
    const card = res.getCardById('grain-depot-b065')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onPlay(game, dennis, 'clay')

    expect(game.state.scheduledGrain[dennis.name][6]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][7]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][9]).toBeUndefined()
  })

  test('schedules 4 grain when paid with stone', () => {
    const card = res.getCardById('grain-depot-b065')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onPlay(game, dennis, 'stone')

    expect(game.state.scheduledGrain[dennis.name][6]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][7]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][9]).toBe(1)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('grain-depot-b065')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 13

    card.onPlay(game, dennis, 'stone')

    expect(game.state.scheduledGrain[dennis.name][14]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][15]).toBeUndefined()
  })

  test('has multiple cost alternatives', () => {
    const card = res.getCardById('grain-depot-b065')
    expect(card.cost).toEqual({ wood: 2 })
    expect(card.costAlternative).toEqual({ clay: 2 })
    expect(card.costAlternative2).toEqual({ stone: 2 })
  })
})
