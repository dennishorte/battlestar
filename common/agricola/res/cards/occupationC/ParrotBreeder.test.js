const t = require('../../../testutil_v2.js')

describe('Parrot Breeder', () => {
  // Card text: "On your turn, if you pay 1 grain, you can use the same action
  // space that the player to your right has just used on their turn."

  test('copies action space of player to the right for 1 grain', () => {
    // 3 players: dennis(0), micah(1), scott(2). dennis's right = micah(1).
    // Use an instant action (Day Laborer) so the copy yields a benefit.
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['parrot-breeder-c150'],
        grain: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // micah (to dennis's right) takes Day Laborer (gives 2 food)
    t.choose(game, 'Day Laborer')

    // scott takes Forest
    t.choose(game, 'Forest')

    // dennis's turn — Day Laborer should be available (copy from micah)
    const choices = t.currentChoices(game)
    expect(choices).toContain('Day Laborer')

    // dennis copies Day Laborer
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        food: 12,
        occupations: ['parrot-breeder-c150'],
      },
    })
  })

  test('cannot copy if no grain to pay', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['parrot-breeder-c150'],
        grain: 0,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // micah takes Forest
    t.choose(game, 'Forest')

    // scott takes Day Laborer
    t.choose(game, 'Day Laborer')

    // dennis's turn — Forest should NOT be available (no grain)
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Forest')
  })

  test('cannot copy action space of player to the left', () => {
    // 3 players: dennis(0), micah(1), scott(2). dennis's left = scott(2).
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'scott',
      dennis: {
        occupations: ['parrot-breeder-c150'],
        grain: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // scott (to dennis's LEFT) takes Forest
    t.choose(game, 'Forest')

    // dennis's turn — Forest should NOT be available (scott is to the left, not right)
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Forest')
  })
})
