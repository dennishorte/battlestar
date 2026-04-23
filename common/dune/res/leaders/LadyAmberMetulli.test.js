const t = require('../../testutil.js')
const leader = require('./LadyAmberMetulli.js')

describe('Lady Amber Metulli', () => {
  test('data', () => {
    expect(leader.name).toBe('Lady Amber Metulli')
    expect(leader.leaderAbility).toContain('Desert Scouts')
  })

  describe('Desert Scouts', () => {
    test('Reveal turn with no deployed troops: Desert Scouts does not prompt', () => {
      // 0 agents → dennis goes straight to Reveal Turn. With no troops in
      // the conflict, Desert Scouts skips and dennis advances to acquire.
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
      })
      game.run()

      expect(game.waiting?.selectors[0].title).not.toContain('Desert Scouts')
    })

    test('Pass leaves troops deployed', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        conflict: { deployedTroops: { dennis: 2 } },
      })
      game.run()

      // First prompt is Desert Scouts retreat?
      t.choose(game, 'Pass')
      expect(game.state.conflict.deployedTroops.dennis).toBe(2)
    })

    test('Retreat sends 1 troop from Conflict to supply', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { agents: 0 },
        conflict: { deployedTroops: { dennis: 2 } },
      })
      game.run()

      const supplyBefore = game.players.byName('dennis').troopsInSupply
      t.choose(game, 'Retreat 1 troop')
      expect(game.state.conflict.deployedTroops.dennis).toBe(1)
      expect(game.players.byName('dennis').troopsInSupply).toBe(supplyBefore + 1)
    })
  })

  describe('Fill Coffers', () => {
    function playFillCoffers(game) {
      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring') // resolve signet ring before Arrakeen
    }

    test('+1 Solari with no alliance', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 0, spice: 0, hand: ['Signet Ring'] },
      })
      game.run()

      playFillCoffers(game)
      expect(game.players.byName('dennis').solari).toBe(1)
      expect(game.players.byName('dennis').spice).toBe(0)
    })

    test('+1 Solari and +1 Spice with any alliance', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 0, spice: 0, hand: ['Signet Ring'] },
        alliances: { emperor: 'dennis' },
      })
      game.run()

      playFillCoffers(game)
      expect(game.players.byName('dennis').solari).toBe(1)
      expect(game.players.byName('dennis').spice).toBe(1)
    })

    test('alliance with a different faction also grants the +1 Spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 0, spice: 0, hand: ['Signet Ring'] },
        alliances: { fremen: 'dennis' },
      })
      game.run()

      playFillCoffers(game)
      expect(game.players.byName('dennis').spice).toBe(1)
    })

    test('opponent alliance does not grant dennis the Spice bonus', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { solari: 0, spice: 0, hand: ['Signet Ring'] },
        alliances: { emperor: 'micah' },
      })
      game.run()

      playFillCoffers(game)
      expect(game.players.byName('dennis').spice).toBe(0)
    })
  })
})
