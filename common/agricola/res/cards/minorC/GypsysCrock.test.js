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

describe("Gypsy's Crock", () => {
  test('+1 food when cooking 2 goods on the same turn', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['gypsys-crock-c053'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 2 }],
        },
      },
    })
    game.run()

    // Cook first sheep (no bonus yet)
    let dennis = game.players.byName('dennis')
    let actions = game.getAnytimeActions(dennis)
    let cookAction = actions.find(a => a.type === 'cook' && a.resource === 'sheep')
    respondAnytimeAction(game, cookAction)

    // Cook second sheep — triggers Gypsy's Crock (+1 food)
    dennis = game.players.byName('dennis')
    actions = game.getAnytimeActions(dennis)
    cookAction = actions.find(a => a.type === 'cook' && a.resource === 'sheep')
    respondAnytimeAction(game, cookAction)

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 5,   // 2 (sheep1) + 2 (sheep2) + 1 (crock bonus for 2 goods)
        grain: 1,
        minorImprovements: ['gypsys-crock-c053'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('no bonus when cooking only 1 good', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['gypsys-crock-c053'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const cookAction = actions.find(a => a.type === 'cook' && a.resource === 'sheep')
    respondAnytimeAction(game, cookAction)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 2,   // 2 (fireplace), no crock bonus (only 1 good)
        grain: 1,
        minorImprovements: ['gypsys-crock-c053'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('counter resets between turns', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['gypsys-crock-c053'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 2 }],
        },
      },
    })
    game.run()

    // Cook 1 sheep on dennis's first turn
    let dennis = game.players.byName('dennis')
    let actions = game.getAnytimeActions(dennis)
    let cookAction = actions.find(a => a.type === 'cook' && a.resource === 'sheep')
    respondAnytimeAction(game, cookAction)
    t.choose(game, 'Grain Seeds')      // dennis turn 1

    t.choose(game, 'Forest')           // micah turn 1

    // Cook 1 sheep on dennis's second turn — no bonus (counter reset)
    dennis = game.players.byName('dennis')
    actions = game.getAnytimeActions(dennis)
    cookAction = actions.find(a => a.type === 'cook' && a.resource === 'sheep')
    respondAnytimeAction(game, cookAction)
    t.choose(game, 'Day Laborer')      // dennis turn 2

    t.choose(game, 'Clay Pit')         // micah turn 2

    t.testBoard(game, {
      dennis: {
        food: 6,   // 2 (sheep1) + 2 (sheep2) + 2 (day laborer) = 6, no crock bonus
        grain: 1,
        minorImprovements: ['gypsys-crock-c053'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })
})
