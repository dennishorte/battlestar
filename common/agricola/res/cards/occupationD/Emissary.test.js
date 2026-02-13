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

describe('Emissary', () => {
  test('exchange 1 wood for 1 stone', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['emissary-d124'],
        wood: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Set up card state (onPlay not called by setBoard)
    game.cardState('emissary-d124').placedGoods = []

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const woodExchange = actions.find(a => a.cardName === 'Emissary' && a.actionArg === 'wood')
    expect(woodExchange).toBeDefined()

    respondAnytimeAction(game, woodExchange)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 1, // 2 - 1
        stone: 1,
        food: 12,
        grain: 1,
        occupations: ['emissary-d124'],
      },
    })

    // Wood should be tracked as placed
    expect(game.cardState('emissary-d124').placedGoods).toContain('wood')
  })

  test('cannot place same good twice', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['emissary-d124'],
        wood: 2,
      },
    })
    game.run()

    game.cardState('emissary-d124').placedGoods = ['wood']

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Emissary' && a.actionArg === 'wood')).toBe(false)
  })

  test('multiple different goods available', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['emissary-d124'],
        wood: 1,
        clay: 1,
        reed: 1,
      },
    })
    game.run()

    game.cardState('emissary-d124').placedGoods = []

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const emissaryActions = actions.filter(a => a.cardName === 'Emissary')
    expect(emissaryActions.length).toBe(3) // wood, clay, reed
  })
})
