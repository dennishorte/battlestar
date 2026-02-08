const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sheep Keeper (B154)', () => {
  test('can only play when player has less than 7 sheep', () => {
    const card = res.getCardById('sheep-keeper-b154')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = jest.fn().mockReturnValue(6)

    expect(card.canPlay(dennis)).toBe(true)
  })

  test('cannot play when player has 7 or more sheep', () => {
    const card = res.getCardById('sheep-keeper-b154')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = jest.fn().mockReturnValue(7)

    expect(card.canPlay(dennis)).toBe(false)
  })

  test('gives 3 bonus points and 2 food when reaching 7 sheep', () => {
    const card = res.getCardById('sheep-keeper-b154')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = jest.fn().mockReturnValue(7)
    dennis.food = 0
    dennis.bonusPoints = 0
    dennis.sheepKeeperTriggered = false

    card.checkTrigger(game, dennis)

    expect(dennis.sheepKeeperTriggered).toBe(true)
    expect(dennis.bonusPoints).toBe(3)
    expect(dennis.food).toBe(2)
  })

  test('does not trigger when less than 7 sheep', () => {
    const card = res.getCardById('sheep-keeper-b154')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = jest.fn().mockReturnValue(6)
    dennis.food = 0
    dennis.bonusPoints = 0
    dennis.sheepKeeperTriggered = false

    card.checkTrigger(game, dennis)

    expect(dennis.sheepKeeperTriggered).toBeFalsy()
    expect(dennis.bonusPoints).toBe(0)
    expect(dennis.food).toBe(0)
  })

  test('only triggers once', () => {
    const card = res.getCardById('sheep-keeper-b154')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = jest.fn().mockReturnValue(8)
    dennis.food = 0
    dennis.bonusPoints = 5
    dennis.sheepKeeperTriggered = true

    card.checkTrigger(game, dennis)

    expect(dennis.bonusPoints).toBe(5)
    expect(dennis.food).toBe(0)
  })
})
