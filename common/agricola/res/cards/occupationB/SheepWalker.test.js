const t = require('../../../testutil_v2.js')

function respondAnytimeAction(game, anytimeAction) {
  const request = game.waiting
  const selector = request.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: 'anytime-action', anytimeAction },
  })
}

describe('Sheep Walker', () => {
  test('exchange 1 sheep → 1 stone', () => {
    const game = t.fixture({ cardSets: ['occupationB'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['sheep-walker-b104'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const toStone = actions.find(a => a.cardName === 'Sheep Walker' && a.to?.stone === 1)
    expect(toStone).toBeDefined()

    respondAnytimeAction(game, toStone)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 12,
        stone: 1,
        grain: 1,
        occupations: ['sheep-walker-b104'],
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 1 }],
        },
      },
    })
  })

  test('exchange 1 sheep → 1 vegetable', () => {
    const game = t.fixture({ cardSets: ['occupationB'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['sheep-walker-b104'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const toVeg = actions.find(a => a.cardName === 'Sheep Walker' && a.to?.vegetables === 1)
    expect(toVeg).toBeDefined()

    respondAnytimeAction(game, toVeg)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 12,
        vegetables: 1,
        grain: 1,
        occupations: ['sheep-walker-b104'],
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 1 }],
        },
      },
    })
  })

  test('not available without sheep', () => {
    const game = t.fixture({ cardSets: ['occupationB'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['sheep-walker-b104'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Sheep Walker')).toBe(false)
  })
})
