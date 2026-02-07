const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hawktower (B014)', () => {
  test('schedules room for round 12 on play', () => {
    const card = res.getCardById('hawktower-b014')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.hawktowerRooms[dennis.name]).toBe(12)
  })

  test('builds free room on round 12 if in stone house', () => {
    const card = res.getCardById('hawktower-b014')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    game.state.hawktowerRooms = { [dennis.name]: 12 }
    game.actions.buildFreeRoom = jest.fn()

    card.onRoundStart(game, dennis, 12)

    expect(game.actions.buildFreeRoom).toHaveBeenCalledWith(dennis, card, 'stone')
    expect(game.state.hawktowerRooms[dennis.name]).toBeUndefined()
  })

  test('discards room on round 12 if not in stone house', () => {
    const card = res.getCardById('hawktower-b014')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    game.state.hawktowerRooms = { [dennis.name]: 12 }
    game.actions.buildFreeRoom = jest.fn()

    card.onRoundStart(game, dennis, 12)

    expect(game.actions.buildFreeRoom).not.toHaveBeenCalled()
    expect(game.state.hawktowerRooms[dennis.name]).toBeUndefined()
  })

  test('does not trigger on other rounds', () => {
    const card = res.getCardById('hawktower-b014')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    game.state.hawktowerRooms = { [dennis.name]: 12 }
    game.actions.buildFreeRoom = jest.fn()

    card.onRoundStart(game, dennis, 10)

    expect(game.actions.buildFreeRoom).not.toHaveBeenCalled()
    expect(game.state.hawktowerRooms[dennis.name]).toBe(12)
  })

  test('requires max round 7', () => {
    const card = res.getCardById('hawktower-b014')
    expect(card.prereqs.maxRound).toBe(7)
  })

  test('costs 2 clay', () => {
    const card = res.getCardById('hawktower-b014')
    expect(card.cost).toEqual({ clay: 2 })
  })
})
