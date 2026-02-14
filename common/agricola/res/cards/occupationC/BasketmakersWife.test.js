const t = require('../../../testutil_v2.js')


describe("Basketmaker's Wife", () => {
  test('onPlay gives 1 reed and 1 food', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC'] })
    t.setBoard(game, {
      dennis: {
        hand: ['basketmakers-wife-c139'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, "Basketmaker's Wife")

    t.testBoard(game, {
      dennis: {
        reed: 1,
        food: 1,
        occupations: ['basketmakers-wife-c139'],
      },
    })
  })

  test('anytime conversion: 1 reed → 2 food', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['basketmakers-wife-c139'],
        reed: 2,
        food: 5,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const conversion = actions.find(a => a.cardName === "Basketmaker's Wife")
    expect(conversion).toBeDefined()

    t.anytimeAction(game, conversion)

    t.testBoard(game, {
      dennis: {
        reed: 1, // 2 - 1 used
        food: 7, // 5 + 2(conversion)
        occupations: ['basketmakers-wife-c139'],
      },
    })
  })

  test('not available when no reed', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['basketmakers-wife-c139'],
        reed: 0,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === "Basketmaker's Wife")).toBe(false)
  })
})
