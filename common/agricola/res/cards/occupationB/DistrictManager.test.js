const t = require('../../../testutil_v2.js')

describe('District Manager', () => {
  // Card text: "At the end of each work phase, if you used both the
  // Forest and Grove accumulation spaces, you get 5 food."
  // Uses onAction + onWorkPhaseEnd. Card is 4+ players.

  test('gives 5 food when both Forest and Grove used', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        familyMembers: 3,
        occupations: ['district-manager-b158'],
      },
    })
    game.run()

    // dennis uses Forest (1st action)
    t.choose(game, 'Forest')
    // other players
    t.choose(game, 'Clay Pit')     // micah
    t.choose(game, 'Reed Bank')    // scott
    t.choose(game, 'Day Laborer')  // eliya
    // dennis uses Grove (2nd action)
    t.choose(game, 'Grove')
    // other players
    t.choose(game, 'Hollow')       // micah
    t.choose(game, 'Fishing')      // scott
    t.choose(game, 'Copse')        // eliya
    // dennis 3rd action
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        wood: 5,   // 3(Forest) + 2(Grove)
        grain: 1,
        food: 5,   // from District Manager
        familyMembers: 3,
        occupations: ['district-manager-b158'],
      },
    })
  })

  test('does not trigger when only Forest used', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['district-manager-b158'],
      },
    })
    game.run()

    t.choose(game, 'Forest')        // dennis
    t.choose(game, 'Clay Pit')      // micah
    t.choose(game, 'Reed Bank')     // scott
    t.choose(game, 'Day Laborer')   // eliya
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Hollow')        // micah
    t.choose(game, 'Fishing')       // scott
    t.choose(game, 'Copse')         // eliya

    t.testBoard(game, {
      dennis: {
        wood: 3,
        grain: 1,
        food: 0,  // no District Manager bonus
        occupations: ['district-manager-b158'],
      },
    })
  })
})
