const t = require('../../../testutil_v2.js')

describe('Pig Owner', () => {
  // Card is 3+ players. checkTrigger: first time you have 5+ wild boar → 3 bonus points (once only).

  test('triggers when player has 5 boar at round start', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-owner-a153'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], boar: 5 },
          ],
        },
      },
    })
    game.run()

    // checkCardTriggers fires at round start → 5 boar → 3 bonus points
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,  // from Day Laborer
        bonusPoints: 3,
        animals: { boar: 5 },
        occupations: ['pig-owner-a153'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], boar: 5 },
          ],
        },
      },
    })
  })

  test('does not trigger with fewer than 5 boar', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-owner-a153'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], boar: 4 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,  // only Day Laborer
        bonusPoints: 0,
        animals: { boar: 4 },
        occupations: ['pig-owner-a153'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], boar: 4 },
          ],
        },
      },
    })
  })

  test('only triggers once', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-owner-a153'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], boar: 5 },
          ],
        },
      },
    })
    game.run()

    // Round 5: trigger fires at round start
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // scott
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Reed Bank')    // micah
    t.choose(game, 'Fishing')      // scott

    // Round 6 start: checkCardTriggers fires again, but already triggered → no extra points

    t.testBoard(game, {
      dennis: {
        food: 2,  // from Day Laborer
        bonusPoints: 3,  // still 3, not 6
        grain: 1,
        animals: { boar: 5 },
        occupations: ['pig-owner-a153'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], boar: 5 },
          ],
        },
      },
    })
  })
})
