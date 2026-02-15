const t = require('../../../testutil_v2.js')

describe('Forest Scientist', () => {
  // Card text: "In the returning home phase, if there is no wood left on
  // the game board, you get 1 food - from round 5 on, even 2 food."
  // Uses onReturnHome. Card is 3+ players.
  // Note: 3-player has Forest + Grove. 4-player adds Copse.

  test('gives 1 food when no wood on board before round 5', () => {
    // 3-player: wood spaces are Forest (3 wood) and Grove (2 wood).
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-scientist-b139'],
      },
    })
    game.run()

    // Take all wood spaces (Forest + Grove)
    t.choose(game, 'Forest')      // dennis (3 wood)
    t.choose(game, 'Grove')       // micah (2 wood)
    t.choose(game, 'Clay Pit')    // scott
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Reed Bank')   // micah
    t.choose(game, 'Fishing')     // scott

    t.testBoard(game, {
      dennis: {
        wood: 3,
        food: 3,  // 2(DL) + 1(FS, round < 5)
        occupations: ['forest-scientist-b139'],
      },
    })
  })

  test('gives 2 food when no wood on board from round 5', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-scientist-b139'],
      },
    })
    game.run()

    t.choose(game, 'Forest')      // dennis
    t.choose(game, 'Grove')       // micah
    t.choose(game, 'Clay Pit')    // scott
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Reed Bank')   // micah
    t.choose(game, 'Fishing')     // scott

    t.testBoard(game, {
      dennis: {
        wood: 3,
        food: 4,  // 2(DL) + 2(FS, round >= 5)
        occupations: ['forest-scientist-b139'],
      },
    })
  })

  test('does not trigger when wood remains on board', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-scientist-b139'],
      },
    })
    game.run()

    // Only take Forest, leave Grove untaken
    t.choose(game, 'Forest')      // dennis
    t.choose(game, 'Clay Pit')    // micah
    t.choose(game, 'Reed Bank')   // scott
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Fishing')     // micah
    t.choose(game, 'Grain Seeds') // scott

    t.testBoard(game, {
      dennis: {
        wood: 3,
        food: 2,  // only DL, no FS
        occupations: ['forest-scientist-b139'],
      },
    })
  })
})
