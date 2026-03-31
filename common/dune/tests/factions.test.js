const t = require('../testutil')

describe('Faction Influence', () => {

  test('visiting a faction space grants +1 influence', () => {
    const game = t.fixture()
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')

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

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
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

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
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

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
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
})
