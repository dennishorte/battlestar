const t = require('../../../testutil_v2.js')

describe('Nutrition Expert', () => {
  // Card text: "At the start of each round, you can exchange a set of
  // 1 animal, 1 grain, and 1 vegetable for 5 food and 2 bonus points."
  // Uses onRoundStart. Card is 1+ players.

  test('exchanges 1 animal + 1 grain + 1 vegetable for 5 food and 2 BP', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['nutrition-expert-b135'],
        grain: 2,
        vegetables: 1,
        pet: 'sheep',
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
          ],
        },
      },
    })
    game.run()

    // Nutrition Expert offers exchange
    t.choose(game, 'Exchange 1 animal + 1 grain + 1 vegetable for 5 food + 2 BP')

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 7,  // 5(NE) + 2(DL)
        grain: 1,  // 2 - 1
        vegetables: 0,
        bonusPoints: 2,
        pet: 'sheep',
        animals: { sheep: 1 },  // 2 - 1 removed
        occupations: ['nutrition-expert-b135'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
          ],
        },
      },
    })
  })

  test('does not trigger without all three resources', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['nutrition-expert-b135'],
        grain: 2,
        // No vegetables and no animals
      },
    })
    game.run()

    // No NE offer — straight to action
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 2,
        bonusPoints: 0,
        occupations: ['nutrition-expert-b135'],
      },
    })
  })

  test('can skip the exchange', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['nutrition-expert-b135'],
        grain: 1,
        vegetables: 1,
        pet: 'sheep',
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Skip')
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 1,
        vegetables: 1,
        bonusPoints: 0,
        pet: 'sheep',
        animals: { sheep: 2 },
        occupations: ['nutrition-expert-b135'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
          ],
        },
      },
    })
  })
})
