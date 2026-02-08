const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Reed-Hatted Toad (C078)', () => {
  test('schedules reed based on offsets from current round', () => {
    const card = res.getCardById('reed-hatted-toad-c078')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 1

    card.onPlay(game, dennis)

    expect(game.state.scheduledReed).toBeDefined()
    expect(game.state.scheduledReed[dennis.name]).toBeDefined()
    expect(game.state.scheduledReed[dennis.name][6]).toBe(1)  // 1 + 5
    expect(game.state.scheduledReed[dennis.name][8]).toBe(1)  // 1 + 7
    expect(game.state.scheduledReed[dennis.name][10]).toBe(1) // 1 + 9
    expect(game.state.scheduledReed[dennis.name][12]).toBe(1) // 1 + 11
    expect(game.state.scheduledReed[dennis.name][14]).toBe(1) // 1 + 13
  })

  test('does not schedule reed beyond round 14', () => {
    const card = res.getCardById('reed-hatted-toad-c078')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onPlay(game, dennis)

    expect(game.state.scheduledReed).toBeDefined()
    expect(game.state.scheduledReed[dennis.name][10]).toBe(1)  // 5 + 5
    expect(game.state.scheduledReed[dennis.name][12]).toBe(1)  // 5 + 7
    expect(game.state.scheduledReed[dennis.name][14]).toBe(1)  // 5 + 9
    expect(game.state.scheduledReed[dennis.name][16]).toBeUndefined() // 5 + 11 > 14
    expect(game.state.scheduledReed[dennis.name][18]).toBeUndefined() // 5 + 13 > 14
  })

  test('has onPlay hook', () => {
    const card = res.getCardById('reed-hatted-toad-c078')
    expect(card.onPlay).toBeDefined()
  })
})
