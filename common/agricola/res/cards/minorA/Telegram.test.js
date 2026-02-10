const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Telegram', () => {
  test('schedules temporary worker based on fences in supply', () => {
    const card = res.getCardById('telegram-a022')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['telegram-a022'],
      },
      round: 3,
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.getFencesInSupply = () => 5
    game.state.round = 3

    card.onPlay(game, dennis)

    expect(game.state.telegramRounds[dennis.name]).toBe(8) // 3 + 5
  })

  test('does not schedule past round 14', () => {
    const card = res.getCardById('telegram-a022')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['telegram-a022'],
      },
      round: 10,
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.getFencesInSupply = () => 10
    game.state.round = 10

    card.onPlay(game, dennis)

    expect(game.state.telegramRounds).toBeUndefined()
  })

  test('has correct cost and vps', () => {
    const card = res.getCardById('telegram-a022')
    expect(card.cost).toEqual({ food: 2 })
    expect(card.vps).toBe(1)
  })
})
