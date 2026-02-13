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

describe('Pellet Press', () => {
  test('pay 1 reed → schedule 1 food/round for 4 rounds', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['pellet-press-d046'],
        occupations: ['clay-firer-d162', 'clay-carrier-d122'],
        reed: 2,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Pellet Press')
    expect(action).toBeDefined()
    expect(action.oncePerRound).toBe(true)

    respondAnytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        reed: 1, // 2 - 1
        food: 5,
        minorImprovements: ['pellet-press-d046'],
        occupations: ['clay-firer-d162', 'clay-carrier-d122'],
        scheduled: {
          food: { 3: 1, 4: 1, 5: 1, 6: 1 },
        },
      },
    })
  })

  test('not available without reed', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['pellet-press-d046'],
        occupations: ['clay-firer-d162', 'clay-carrier-d122'],
        reed: 0,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Pellet Press')).toBe(false)
  })
})
