const t = require('../../testutil.js')
const leader = require('./DukeLetoAtreides.js')

describe('Duke Leto Atreides', () => {
  test('data', () => {
    expect(leader.name).toBe('Duke Leto Atreides')
    expect(leader.source).toBe('Base')
    expect(leader.house).toBe('Atreides')
  })

  test('Landsraad Popularity: green space cost -1 Solari', () => {
    const baseCost = { solari: 3 }
    const space = { icon: 'green' }
    const cost = leader.modifySpaceCost({}, {}, space, baseCost)
    expect(cost.solari).toBe(2)
  })

  test('Landsraad Popularity: does not go below 0', () => {
    const cost = leader.modifySpaceCost({}, {}, { icon: 'green' }, { solari: 0 })
    expect(cost.solari).toBe(0)
  })

  test('Landsraad Popularity: non-green spaces unaffected', () => {
    const cost = leader.modifySpaceCost({}, {}, { icon: 'yellow' }, { solari: 3 })
    expect(cost.solari).toBe(3)
  })

  test('assigns to a player in-game', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    expect(game.state.leaders.dennis.name).toBe('Duke Leto Atreides')
  })

  describe('Prudent Diplomacy', () => {
    // Assembly Hall: green, non-combat, no troops/costs — deploy step never fires
    function playSignet(game) {
      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Assembly Hall')
      t.choose(game, 'Signet Ring')
    }

    test('pays 1 Spice for +1 Influence with chosen eligible faction', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        // Two eligible factions so a real prompt fires (not auto-resolved)
        dennis: { spice: 2, influence: { emperor: 0, guild: 0 }, hand: ['Signet Ring'] },
        micah: { influence: { emperor: 1, guild: 1 } },
      })
      game.run()

      playSignet(game)
      t.choose(game, 'emperor')

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(1)
      expect(dennis.getInfluence('emperor')).toBe(1)
    })

    test('only offers factions where an opponent leads', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        // dennis leads emperor; micah leads guild — only guild should be offered
        dennis: { spice: 2, influence: { emperor: 2, guild: 0, 'bene-gesserit': 0, fremen: 0 }, hand: ['Signet Ring'] },
        micah: { influence: { emperor: 1, guild: 2, 'bene-gesserit': 0, fremen: 0 } },
      })
      game.run()

      playSignet(game)

      // Pass + guild only (emperor not eligible)
      const choices = game.waiting?.selectors[0].choices?.map(o => o.id || o.title) ?? []
      expect(choices).toContain('pass')
      expect(choices).toContain('guild')
      expect(choices).not.toContain('emperor')
    })

    test('player can pass and keep their Spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 1, influence: { emperor: 0 }, hand: ['Signet Ring'] },
        micah: { influence: { emperor: 1 } },
      })
      game.run()

      playSignet(game)
      t.choose(game, 'Pass')

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(1)
      expect(dennis.getInfluence('emperor')).toBe(0)
    })

    test('no prompt when player has no Spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0, influence: { emperor: 0 }, hand: ['Signet Ring'] },
        micah: { influence: { emperor: 1 } },
      })
      game.run()

      playSignet(game)

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(0)
      expect(dennis.getInfluence('emperor')).toBe(0)
    })

    test('no action taken when no faction has an opponent ahead', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 2, influence: { emperor: 3, guild: 3, 'bene-gesserit': 3, fremen: 3 }, hand: ['Signet Ring'] },
        micah: { influence: { emperor: 0, guild: 0, 'bene-gesserit': 0, fremen: 0 } },
      })
      game.run()

      playSignet(game)

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(2)
    })
  })
})
