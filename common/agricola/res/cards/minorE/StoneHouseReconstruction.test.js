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

describe('Stone House Reconstruction', () => {
  test('renovate from clay to stone using normal cost', () => {
    const game = t.fixture({ cardSets: ['minorE'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['stone-house-reconstruction-e013'],
        roomType: 'clay',
        stone: 5,
        reed: 3,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Stone House Reconstruction')
    expect(action).toBeDefined()

    respondAnytimeAction(game, action)

    // Standard clay→stone cost: 2 stone (1/room × 2 rooms) + 1 reed
    t.testBoard(game, {
      dennis: {
        stone: 3,  // 5 - 2
        reed: 2,   // 3 - 1
        roomType: 'stone',
        minorImprovements: ['stone-house-reconstruction-e013'],
      },
    })
  })

  test('not available from wood house', () => {
    const game = t.fixture({ cardSets: ['minorE'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['stone-house-reconstruction-e013'],
        roomType: 'wood',
        stone: 5,
        reed: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Stone House Reconstruction')).toBe(false)
  })

  test('not available without enough resources', () => {
    const game = t.fixture({ cardSets: ['minorE'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['stone-house-reconstruction-e013'],
        roomType: 'clay',
        stone: 1,  // need 2
        reed: 1,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Stone House Reconstruction')).toBe(false)
  })
})
