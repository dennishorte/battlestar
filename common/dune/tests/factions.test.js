const t = require('../testutil')

describe('Faction Influence', () => {

  test('visiting a faction space grants +1 influence', () => {
    const game = t.fixture()
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')

    const spaces = t.currentChoices(game)
    expect(spaces).toContain('Dutiful Service')
    t.choose(game, 'Dutiful Service')

    t.testBoard(game, {
      dennis: { influence: { emperor: 1 } },
    })
  })

  test('VP gained when reaching 2 influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { emperor: 1 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Dutiful Service')

    t.testBoard(game, {
      dennis: { influence: { emperor: 2 }, vp: 1 },
    })
  })

  test('VP threshold at 2 influence is defined in constants', () => {
    const constants = require('../res/constants.js')
    expect(constants.INFLUENCE_VP_THRESHOLD).toBe(2)
  })

  test('bonus at 4 influence: Guild gives 3 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { guild: 3 }, solari: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Deliver Supplies')

    const player = game.players.byName('dennis')
    expect(player.getInfluence('guild')).toBe(4)
    expect(player.solari).toBe(3)
  })

  test('first player to 4 influence earns alliance (+1 VP)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { emperor: 3 }, vp: 1 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Dutiful Service')
    // Emperor 4-influence bonus: place a spy
    t.choose(game, t.currentChoices(game)[0])

    expect(game.state.alliances.emperor).toBe('dennis')
    t.testBoard(game, {
      dennis: { influence: { emperor: 4 }, vp: 2 },
    })
  })

  test('alliance is held by first player to reach threshold', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { fremen: 4 }, vp: 3 },
      micah: { influence: { fremen: 3 } },
      alliances: { fremen: 'dennis' },
    })
    game.run()

    // Dennis holds the fremen alliance at 4
    expect(game.state.alliances.fremen).toBe('dennis')

    // Micah at 3 fremen — verify they are set up correctly
    const micah = game.players.byName('micah')
    expect(micah.getInfluence('fremen')).toBe(3)
  })

  test('alliance transfers when holder drops from a 3-way tie (4 -> 3), holder chooses recipient', () => {
    const game = t.fixture()
    t.setBoard(game, {
      alliances: { emperor: 'dennis' },
      dennis: {
        influence: { emperor: 4, guild: 1 },
        solari: 2,
        vp: 5,
        intrigue: ['Opportunism'],
      },
      micah: { influence: { emperor: 4 }, vp: 0 },
      scott: { influence: { emperor: 4 }, vp: 0 },
    })
    game.run()

    // Play Opportunism: lose 1 Influence with 2 factions + 2 Solari -> +1 VP
    t.choose(game, 'Opportunism')
    t.choose(game, 'Lose 1 Influence with 2 Factions + 2 Solari -> +1 VP')
    // Lose emperor first: dennis drops from 4 to 3, behind micah/scott (both still at 4)
    t.choose(game, 'emperor')
    // Micah and scott are tied for the alliance — dennis (who just lost it) chooses
    t.choose(game, 'micah')
    // Second required loss for Opportunism (throwaway, unrelated to the alliance)
    t.choose(game, 'guild')

    expect(game.state.alliances.emperor).toBe('micah')

    t.testBoard(game, {
      dennis: { influence: { emperor: 3, guild: 0 }, solari: 0, vp: 5 },
      micah: { influence: { emperor: 4 }, vp: 1 },
      scott: { influence: { emperor: 4 }, vp: 0 },
    })
  })

  test('alliance transfers when holder drops with only one valid recipient (5 -> 4), no choice needed', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      alliances: { fremen: 'dennis' },
      dennis: {
        influence: { fremen: 5, guild: 1 },
        solari: 2,
        vp: 5,
        intrigue: ['Opportunism'],
      },
      micah: { influence: { fremen: 5 }, vp: 0 },
    })
    game.run()

    t.choose(game, 'Opportunism')
    t.choose(game, 'Lose 1 Influence with 2 Factions + 2 Solari -> +1 VP')
    // Lose fremen first: dennis drops from 5 to 4, behind micah (still at 5).
    // Micah is the only player who could receive it, so no recipient prompt appears —
    // the very next choice is Opportunism's second required loss.
    t.choose(game, 'fremen')
    t.choose(game, 'guild')

    expect(game.state.alliances.fremen).toBe('micah')

    t.testBoard(game, {
      dennis: { influence: { fremen: 4, guild: 0 }, solari: 0, vp: 5 },
      micah: { influence: { fremen: 5 }, vp: 1 },
    })
  })

  test('alliance is retained when holder drops but remains at or above 4 influence', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      alliances: { fremen: 'dennis' },
      dennis: {
        influence: { fremen: 5, guild: 1 },
        solari: 2,
        vp: 5,
        intrigue: ['Opportunism'],
      },
      micah: { influence: { fremen: 1 }, vp: 0 },
    })
    game.run()

    t.choose(game, 'Opportunism')
    t.choose(game, 'Lose 1 Influence with 2 Factions + 2 Solari -> +1 VP')
    // Dennis drops from 5 to 4 fremen — still at the 4-influence threshold and
    // still ahead of micah's 1, so the alliance stays put.
    t.choose(game, 'fremen')
    t.choose(game, 'guild')

    expect(game.state.alliances.fremen).toBe('dennis')

    t.testBoard(game, {
      dennis: { influence: { fremen: 4, guild: 0 }, solari: 0, vp: 6 },
      micah: { influence: { fremen: 1 }, vp: 0 },
    })
  })

  test('alliance returns to the supply when holder drops below 4 and nobody else has reached it', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      alliances: { fremen: 'dennis' },
      dennis: {
        influence: { fremen: 4, guild: 1 },
        solari: 2,
        vp: 5,
        intrigue: ['Opportunism'],
      },
      micah: { influence: { fremen: 2 }, vp: 0 },
    })
    game.run()

    t.choose(game, 'Opportunism')
    t.choose(game, 'Lose 1 Influence with 2 Factions + 2 Solari -> +1 VP')
    // Dennis drops from 4 to 3 fremen. Micah (at 2) hasn't reached 4 either,
    // so nobody receives the alliance — it returns to the supply.
    t.choose(game, 'fremen')
    t.choose(game, 'guild')

    expect(game.state.alliances.fremen).toBe(null)

    t.testBoard(game, {
      // -1 VP for losing the alliance, +1 VP from Opportunism's reward: net 0.
      dennis: { influence: { fremen: 3, guild: 0 }, solari: 0, vp: 5 },
      micah: { influence: { fremen: 2 }, vp: 0 },
    })
  })
})
