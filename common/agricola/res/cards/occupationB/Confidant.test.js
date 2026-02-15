const t = require('../../../testutil_v2.js')

describe('Confidant', () => {
  test('onPlay places food on next 2 round spaces when choosing 2', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['confidant-b093'],
        food: 4,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Confidant')
    t.choose(game, t.currentChoices(game)[0])  // e.g. '2 spaces'

    // Round 2 when playing; next 2 rounds are 3, 4
    t.testBoard(game, {
      dennis: {
        occupations: ['confidant-b093'],
        food: 2,
        scheduled: { food: { 3: 1, 4: 1 } },
      },
    })
  })

  test('onPlay with insufficient food does not offer choice', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['confidant-b093'],
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Confidant')

    // No Confidant prompt; card played but no scheduling
    t.testBoard(game, {
      dennis: {
        occupations: ['confidant-b093'],
        food: 0,
      },
    })
  })
})
