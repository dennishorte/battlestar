const t = require('../../../testutil_v2.js')

describe("Alchemist's Lab", () => {
  test('owner uses action space — gets 1 of each resource they have, no food cost', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['alchemists-lab-e081'],
        wood: 2,
        clay: 1,
        stone: 0,
        reed: 3,
        food: 5,
      },
    })
    game.run()

    t.choose(game, "Alchemist's Lab")

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['alchemists-lab-e081'],
        wood: 3,
        clay: 2,
        stone: 0,
        reed: 4,
        food: 5, // no food cost for owner
      },
    })
  })

  test('other player uses action space — pays 1 food to owner, gets resources', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['alchemists-lab-e081'],
      },
      micah: {
        wood: 1,
        clay: 0,
        stone: 2,
        reed: 0,
        food: 3,
      },
    })
    game.run()

    t.choose(game, "Alchemist's Lab")

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['alchemists-lab-e081'],
        food: 1, // gained 1 food from micah
      },
      micah: {
        wood: 2, // had 1 + gained 1
        clay: 0, // had 0, no gain
        stone: 3, // had 2 + gained 1
        reed: 0, // had 0, no gain
        food: 2, // 3 - 1 paid to owner
      },
    })
  })

  test('other player cannot use without food', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['alchemists-lab-e081'],
      },
      micah: {
        food: 0,
      },
    })
    game.run()

    expect(t.currentChoices(game)).not.toContain("Alchemist's Lab")
  })
})
