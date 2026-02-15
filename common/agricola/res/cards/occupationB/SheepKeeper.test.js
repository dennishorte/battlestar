const t = require('../../../testutil_v2.js')

describe('Sheep Keeper', () => {
  // Card text: "You can only play this card if you have less than 7 sheep.
  // Once this game, when you have 7 sheep in your farmyard, you immediately
  // get 3 bonus points and 2 food."
  // Uses checkTrigger. Card is 3+ players.

  test('triggers when player reaches 7 sheep', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sheep-keeper-b154'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 7 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 4,  // 2 from Day Laborer + 2 from Sheep Keeper
        bonusPoints: 3,
        animals: { sheep: 7 },
        occupations: ['sheep-keeper-b154'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 7 },
          ],
        },
      },
    })
  })

  test('does not trigger with fewer than 7 sheep', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sheep-keeper-b154'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 4 },
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
        animals: { sheep: 4 },
        occupations: ['sheep-keeper-b154'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 4 },
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
        occupations: ['sheep-keeper-b154'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 7 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Clay Pit')    // scott
    t.choose(game, 'Grain Seeds') // dennis 2nd action

    // Still only 3 bonus points, not 6
    t.testBoard(game, {
      dennis: {
        food: 4,  // 2 from Day Laborer + 2 from Sheep Keeper (once)
        bonusPoints: 3,
        grain: 1,
        animals: { sheep: 7 },
        occupations: ['sheep-keeper-b154'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 7 },
          ],
        },
      },
    })
  })
})
