const t = require('../../../testutil_v2.js')

describe('Shovel Bearer', () => {
  // Card is 3+ players only; Clay Pit = take-clay, Hollow = hollow (3p). Hollow not in getAllActionSpaces(), so set its accumulated via breakpoint.
  test('onAction gives food equal to clay on Hollow when using Clay Pit', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Clay Pit', accumulated: 1 }],
      dennis: {
        occupations: ['shovel-bearer-a140'],
        clay: 0,
        food: 0,
      },
    })
    game.testSetBreakpoint('replenish-complete', (g) => {
      if (g.state.actionSpaces['hollow']) {
        g.state.actionSpaces['hollow'].accumulated = 2
      }
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        occupations: ['shovel-bearer-a140'],
        clay: 1,
        food: 2, // from Shovel Bearer (clay on Hollow)
      },
    })
  })

  test('onAction gives food equal to clay on Clay Pit when using Hollow', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Clay Pit', accumulated: 3 }],
      dennis: {
        occupations: ['shovel-bearer-a140'],
        clay: 0,
        food: 0,
      },
    })
    game.testSetBreakpoint('replenish-complete', (g) => {
      if (g.state.actionSpaces['hollow']) {
        g.state.actionSpaces['hollow'].accumulated = 1
      }
    })
    game.run()

    t.choose(game, 'Hollow')

    t.testBoard(game, {
      dennis: {
        occupations: ['shovel-bearer-a140'],
        clay: 1,
        food: 3, // from Shovel Bearer (clay on Clay Pit)
      },
    })
  })

  test('onAction gives no food when other space has no clay', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Clay Pit', accumulated: 1 }],
      dennis: {
        occupations: ['shovel-bearer-a140'],
        clay: 0,
        food: 0,
      },
    })
    game.testSetBreakpoint('replenish-complete', (g) => {
      if (g.state.actionSpaces['hollow']) {
        g.state.actionSpaces['hollow'].accumulated = 0
      }
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        occupations: ['shovel-bearer-a140'],
        clay: 1,
        food: 0,
      },
    })
  })
})
