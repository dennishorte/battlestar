const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Farmyard Manure', () => {
  test('schedules food on next 3 round spaces on stable build', () => {
    const card = res.getCardById('farmyard-manure-a043')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['farmyard-manure-a043'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
      round: 5,
    })
    game.run()

    const dennis = t.dennis(game)
    game.state.round = 5
    card.onBuildStable(game, dennis)

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })

  test('does not schedule food past round 14', () => {
    const card = res.getCardById('farmyard-manure-a043')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['farmyard-manure-a043'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
      round: 13,
    })
    game.run()

    const dennis = t.dennis(game)
    game.state.round = 13
    card.onBuildStable(game, dennis)

    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
    expect(game.state.scheduledFood[dennis.name][16]).toBeUndefined()
  })
})
