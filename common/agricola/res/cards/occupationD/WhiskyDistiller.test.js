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

describe('Whisky Distiller', () => {
  test('pay 1 grain → schedule 4 food in 2 rounds', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 3,
      dennis: {
        occupations: ['whisky-distiller-d106'],
        grain: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const activate = actions.find(a => a.cardName === 'Whisky Distiller')
    expect(activate).toBeDefined()

    respondAnytimeAction(game, activate)

    // Finish round 3
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        grain: 2, // 2 - 1(used) + 1(Grain Seeds)
        food: 12, // 10 + 2(DL)
        occupations: ['whisky-distiller-d106'],
        scheduled: {
          food: { 5: 4 }, // round 3 + 2 = round 5
        },
      },
    })
  })

  test('not available without grain', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['whisky-distiller-d106'],
        grain: 0,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Whisky Distiller')).toBe(false)
  })
})
