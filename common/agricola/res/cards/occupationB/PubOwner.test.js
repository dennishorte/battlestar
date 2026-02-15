const t = require('../../../testutil_v2.js')

describe('Pub Owner', () => {
  // Card text: "Immediately, when you play this card, and at the end of
  // each work phase, in which the 'Forest', 'Clay Pit', and 'Reed Bank'
  // accumulation spaces are all occupied, you get 1 grain."
  // Uses onPlay + onWorkPhaseEnd hooks. Card is 4+ players.

  test('gives 1 grain at end of work phase when Forest, Clay Pit, Reed Bank all occupied', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pub-owner-b160'],
      },
    })
    game.run()

    // Place all 8 workers; ensure Forest, Clay Pit, Reed Bank are occupied
    t.choose(game, 'Forest')         // dennis 1
    t.choose(game, 'Clay Pit')       // micah 1
    t.choose(game, 'Reed Bank')      // scott 1
    t.choose(game, 'Day Laborer')    // eliya 1
    t.choose(game, 'Grain Seeds')    // dennis 2
    t.choose(game, 'Hollow')         // micah 2
    t.choose(game, 'Fishing')        // scott 2
    t.choose(game, 'Copse')          // eliya 2

    t.testBoard(game, {
      dennis: {
        wood: 3,
        grain: 2,  // 1 from Grain Seeds + 1 from Pub Owner
        occupations: ['pub-owner-b160'],
      },
    })
  })

  test('does not give grain when not all three are occupied', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pub-owner-b160'],
      },
    })
    game.run()

    // Don't occupy Reed Bank
    t.choose(game, 'Forest')         // dennis 1
    t.choose(game, 'Clay Pit')       // micah 1
    t.choose(game, 'Day Laborer')    // scott 1
    t.choose(game, 'Hollow')         // eliya 1
    t.choose(game, 'Grain Seeds')    // dennis 2
    t.choose(game, 'Copse')          // micah 2
    t.choose(game, 'Fishing')        // scott 2
    t.choose(game, 'Grove')          // eliya 2

    t.testBoard(game, {
      dennis: {
        wood: 3,
        grain: 1,  // only Grain Seeds, no Pub Owner
        occupations: ['pub-owner-b160'],
      },
    })
  })
})
