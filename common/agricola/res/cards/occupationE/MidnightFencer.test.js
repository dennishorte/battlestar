const t = require('../../../testutil_v2.js')

describe('Midnight Fencer', () => {
  test('does not trigger at non-final harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // harvest 1, not the last
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['midnight-fencer-e149'],
        food: 8,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest fires but MidnightFencer should NOT trigger (not harvest 6)
    // No fence-stealing prompt should appear
    t.testBoard(game, {
      round: 5,
      dennis: {
        food: 6, // 8 + 2 - 4
        clay: 1, // Clay Pit accumulates 1
        occupations: ['midnight-fencer-e149'],
      },
    })
  })

  test('steals fences at final harvest and builds them free, exceeding 15', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 14, // harvest 6 — the last
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['midnight-fencer-e149'],
        food: 4,
        farmyard: {
          pastures: [
            { spaces: [
              { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
              { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            ] },
          ],
        },
      },
      micah: { food: 4 },
      scott: { food: 4 },
    })
    game.run()

    // Work phase: each player places 2 workers
    t.choose(game, 'Forest')      // dennis
    t.choose(game, 'Clay Pit')    // micah
    t.choose(game, 'Reed Bank')   // scott
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Fishing')     // micah
    t.choose(game, 'Grain Seeds') // scott

    // Final harvest: steal 2 from each opponent, then build them for free
    t.choose(game, 'Take 2 fences from micah')
    t.choose(game, 'Take 2 fences from scott')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 1 }, { row: 2, col: 2 }] })

    const dennis = game.players.byName('dennis')
    const micah = game.players.byName('micah')
    const scott = game.players.byName('scott')
    // 12 existing + 4 stolen-and-built = 16 fences on board (over 15)
    expect(dennis.getFenceCount()).toBe(16)
    expect(dennis.getFencesInSupply()).toBe(-1)
    expect(dennis.wood).toBe(3) // 3 wood from Forest, none spent on fences
    expect(micah.usedFences).toBe(2)
    expect(micah.getFencesInSupply()).toBe(13)
    expect(scott.getFencesInSupply()).toBe(13)
  })

  test('card can be played without crashing', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['midnight-fencer-e149'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Midnight Fencer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['midnight-fencer-e149'],
      },
    })
  })
})
