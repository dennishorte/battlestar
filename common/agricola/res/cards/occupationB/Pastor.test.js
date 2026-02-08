const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pastor (B163)', () => {
  test('gives resources when player is the only one with 2 rooms', () => {
    const card = res.getCardById('pastor-b163')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    const scott = t.player(game, 'scott')
    const eliya = t.player(game, 'eliya')

    dennis.getRoomCount = jest.fn().mockReturnValue(2)
    micah.getRoomCount = jest.fn().mockReturnValue(3)
    scott.getRoomCount = jest.fn().mockReturnValue(4)
    eliya.getRoomCount = jest.fn().mockReturnValue(3)

    dennis.wood = 0
    dennis.clay = 0
    dennis.reed = 0
    dennis.stone = 0
    dennis.pastorTriggered = false

    card.checkTrigger(game, dennis)

    expect(dennis.pastorTriggered).toBe(true)
    expect(dennis.wood).toBe(3)
    expect(dennis.clay).toBe(2)
    expect(dennis.reed).toBe(1)
    expect(dennis.stone).toBe(1)
  })

  test('does not trigger when multiple players have 2 rooms', () => {
    const card = res.getCardById('pastor-b163')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    const scott = t.player(game, 'scott')
    const eliya = t.player(game, 'eliya')

    dennis.getRoomCount = jest.fn().mockReturnValue(2)
    micah.getRoomCount = jest.fn().mockReturnValue(2)
    scott.getRoomCount = jest.fn().mockReturnValue(4)
    eliya.getRoomCount = jest.fn().mockReturnValue(3)

    dennis.wood = 0
    dennis.pastorTriggered = false

    card.checkTrigger(game, dennis)

    expect(dennis.pastorTriggered).toBeFalsy()
    expect(dennis.wood).toBe(0)
  })

  test('only triggers once', () => {
    const card = res.getCardById('pastor-b163')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    const scott = t.player(game, 'scott')
    const eliya = t.player(game, 'eliya')

    dennis.getRoomCount = jest.fn().mockReturnValue(2)
    micah.getRoomCount = jest.fn().mockReturnValue(3)
    scott.getRoomCount = jest.fn().mockReturnValue(4)
    eliya.getRoomCount = jest.fn().mockReturnValue(3)

    dennis.wood = 5
    dennis.pastorTriggered = true

    card.checkTrigger(game, dennis)

    expect(dennis.wood).toBe(5)
  })
})
