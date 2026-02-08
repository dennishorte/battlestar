const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sheep Whisperer (B164)', () => {
  test('schedules sheep on rounds current+2, +5, +8, +10', () => {
    const card = res.getCardById('sheep-whisperer-b164')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()
    game.state.round = 1

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledSheep.dennis[3]).toBe(1)  // 1+2
    expect(game.state.scheduledSheep.dennis[6]).toBe(1)  // 1+5
    expect(game.state.scheduledSheep.dennis[9]).toBe(1)  // 1+8
    expect(game.state.scheduledSheep.dennis[11]).toBe(1) // 1+10
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('sheep-whisperer-b164')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()
    game.state.round = 8

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledSheep.dennis[10]).toBe(1)  // 8+2
    expect(game.state.scheduledSheep.dennis[13]).toBe(1)  // 8+5
    // 8+8=16 and 8+10=18 are beyond round 14
    expect(game.state.scheduledSheep.dennis[16]).toBeUndefined()
    expect(game.state.scheduledSheep.dennis[18]).toBeUndefined()
  })
})
