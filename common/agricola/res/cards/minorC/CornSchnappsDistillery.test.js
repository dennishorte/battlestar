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

describe('Corn Schnapps Distillery', () => {
  test('pay 1 grain → schedule 1 food/round for 4 rounds', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['corn-schnapps-distillery-c064'],
        grain: 2,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Corn Schnapps Distillery')
    expect(action).toBeDefined()
    expect(action.oncePerRound).toBe(true)

    respondAnytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        grain: 1, // 2 - 1
        food: 5,
        minorImprovements: ['corn-schnapps-distillery-c064'],
        scheduled: {
          food: { 3: 1, 4: 1, 5: 1, 6: 1 },
        },
      },
    })
  })

  test('not available after use this round', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['corn-schnapps-distillery-c064'],
        grain: 3,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const action = game.getAnytimeActions(dennis).find(a => a.cardName === 'Corn Schnapps Distillery')
    respondAnytimeAction(game, action)

    const actions2 = game.getAnytimeActions(dennis)
    expect(actions2.some(a => a.cardName === 'Corn Schnapps Distillery')).toBe(false)
  })

  test('not available without grain', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['corn-schnapps-distillery-c064'],
        grain: 0,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Corn Schnapps Distillery')).toBe(false)
  })
})
