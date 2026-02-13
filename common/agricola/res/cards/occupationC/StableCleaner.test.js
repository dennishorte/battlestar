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

describe('Stable Cleaner', () => {
  test('build one stable for 1 wood + 1 food', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['stable-cleaner-c094'],
        wood: 3,
        food: 3,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Stable Cleaner')
    expect(action).toBeDefined()

    respondAnytimeAction(game, action)
    t.choose(game, '0,1')  // build stable at (0,1)
    t.choose(game, 'Done')  // done building

    t.testBoard(game, {
      dennis: {
        wood: 2,   // 3 - 1
        food: 2,   // 3 - 1
        occupations: ['stable-cleaner-c094'],
        farmyard: {
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('build multiple stables', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['stable-cleaner-c094'],
        wood: 3,
        food: 3,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const action = game.getAnytimeActions(dennis).find(a => a.cardName === 'Stable Cleaner')

    respondAnytimeAction(game, action)
    t.choose(game, '0,1')   // first stable
    t.choose(game, '1,1')   // second stable
    t.choose(game, 'Done')

    t.testBoard(game, {
      dennis: {
        wood: 1,   // 3 - 2
        food: 1,   // 3 - 2
        occupations: ['stable-cleaner-c094'],
        farmyard: {
          stables: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
  })

  test('not available without enough resources', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['stable-cleaner-c094'],
        wood: 0,
        food: 3,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Stable Cleaner')).toBe(false)
  })

  test('not available without valid spaces', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['stable-cleaner-c094'],
        wood: 3,
        food: 3,
        farmyard: {
          rooms: [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
          fields: [
            { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 1 }, { row: 2, col: 2 },
            { row: 0, col: 3 }, { row: 1, col: 3 }, { row: 2, col: 3 },
            { row: 0, col: 4 }, { row: 1, col: 4 }, { row: 2, col: 4 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Stable Cleaner')).toBe(false)
  })
})
