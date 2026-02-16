const t = require('../../../testutil_v2.js')

describe('Omnifarmer', () => {
  test('places a crop on the card during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        hand: ['omnifarmer-e134'],
        grain: 2,
        food: 5,
      },
      micah: { food: 4 },
    })
    // Play Omnifarmer in an earlier round to trigger onPlay
    game.testSetBreakpoint('initialization-complete', (game) => {
      // Manually move card to occupations zone and trigger onPlay
      const dennis = game.players.byName('dennis')
      const card = game.cards.byId('omnifarmer-e134')
      const occZone = game.zones.byPlayer(dennis, 'occupations')
      card.moveTo(occZone)
      // Remove from hand
      // Initialize card state
      game.cardState('omnifarmer-e134').goods = []
      game.cardState('omnifarmer-e134').exchanged = false
    })
    game.run()

    // 4 actions
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: onHarvest fires — place 1 grain on card
    t.choose(game, 'Place 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 1,   // 2 - 1
        food: 3,    // 5 + 2 (DL) - 4 (feeding)
        reed: 1,
        occupations: ['omnifarmer-e134'],
      },
    })
    expect(game.cardState('omnifarmer-e134').goods).toEqual(['grain'])
  })

  test('anytime exchange with 2 different goods gives 3 VP', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['omnifarmer-e134'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('omnifarmer-e134').goods = ['grain', 'vegetable']
      game.cardState('omnifarmer-e134').exchanged = false
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.id === 'omnifarmer-exchange')
    expect(action).toBeDefined()
    expect(action.label).toContain('3 VP')

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        bonusPoints: 3,
        occupations: ['omnifarmer-e134'],
      },
    })
    expect(game.cardState('omnifarmer-e134').exchanged).toBe(true)
  })

  test('anytime exchange with 4 different goods gives 7 VP', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['omnifarmer-e134'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('omnifarmer-e134').goods = ['grain', 'vegetable', 'sheep', 'boar']
      game.cardState('omnifarmer-e134').exchanged = false
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.id === 'omnifarmer-exchange')
    expect(action).toBeDefined()
    expect(action.label).toContain('7 VP')

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        bonusPoints: 7,
        occupations: ['omnifarmer-e134'],
      },
    })
  })
})
