const t = require('../testutil')

describe('Faction Influence', () => {

  test('visiting a faction space grants +1 influence', () => {
    const game = t.fixture()
    game.run()

    // Dennis has Diplomacy (factionAccess: all 4 factions)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')

    // Pick Dutiful Service (emperor, no cost)
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

    // Dennis plays Diplomacy to Dutiful Service (emperor, no cost)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Dutiful Service')

    // Emperor influence: 1 → 2 → +1 VP
    t.testBoard(game, {
      dennis: { influence: { emperor: 2 }, vp: 1 },
    })
  })

  test('VP lost when dropping below 2 influence', () => {
    const factions = require('../systems/factions')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { emperor: 2 }, vp: 2 },
    })
    game.run()

    // Directly lose influence via the factions system
    // (this happens through combat intrigue cards, etc.)
    const player = game.players.byName('dennis')
    factions.loseInfluence(game, player, 'emperor', 1)

    t.testBoard(game, {
      dennis: { influence: { emperor: 1 }, vp: 1 },
    })
  })

  test('bonus at 4 influence: Guild gives 3 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { guild: 3 }, solari: 0 },
    })
    game.run()

    // Dennis plays Diplomacy to Deliver Supplies (guild, no cost)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Deliver Supplies')

    // Guild influence 3 → 4: +3 Solari bonus
    // Deliver Supplies also gives +1 Water
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

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Dutiful Service')
    // Emperor 4-influence bonus: place a spy
    t.choose(game, t.currentChoices(game)[0])

    // Emperor 3 → 4: alliance earned
    expect(game.state.alliances.emperor).toBe('dennis')
    // VP: started 1, +1 for alliance = 2
    t.testBoard(game, {
      dennis: { influence: { emperor: 4 }, vp: 2 },
    })
  })

  test('alliance passes when opponent overtakes on influence track', () => {
    const factions = require('../systems/factions')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { fremen: 4 }, vp: 3 },
      alliances: { fremen: 'dennis' },
    })
    game.run()

    // Micah gains influence to 5 fremen, overtaking dennis at 4
    const micah = game.players.byName('micah')
    // Set micah's fremen influence to 4 first
    micah.setInfluence('fremen', 4)
    // Now gain 1 more to overtake
    factions.gainInfluence(game, micah, 'fremen', 1)

    expect(game.state.alliances.fremen).toBe('micah')
    // Dennis loses 1 VP, micah gains 1 VP
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(2)
  })
})
