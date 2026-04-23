const t = require('../../testutil.js')
const leader = require('./LadyJessica.js')

describe('Lady Jessica', () => {
  test('data', () => {
    expect(leader.name).toBe('Lady Jessica')
    expect(leader.leaderAbility).toContain('Other Memories')
    expect(leader.signetRingAbility).toContain('Spice Agony')
  })

  test('onAssign initializes jessicaMemories / jessicaFlipped', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    expect(game.state.jessicaMemories.dennis).toBe(0)
    expect(game.state.jessicaFlipped.dennis).toBe(false)
  })

  describe('Spice Agony (unflipped signet ring)', () => {
    function playSignet(game) {
      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
    }

    test('converts 1 Spice + 1 troop into 1 Intrigue + 1 Memory', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 1, hand: ['Signet Ring'] },
      })
      game.run()

      const supplyBefore = game.players.byName('dennis').troopsInSupply
      const intrigueBefore = game.zones.byId('dennis.intrigue').cardlist().length

      playSignet(game)
      t.choose(game, 'Spice Agony (1 Spice → 1 Intrigue + 1 Memory)')

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(0)
      // -1 troop from Spice Agony + -1 troop from Arrakeen's recruit effect.
      expect(dennis.troopsInSupply).toBe(supplyBefore - 2)
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(intrigueBefore + 1)
      expect(game.state.jessicaMemories.dennis).toBe(1)
    })

    test('Pass leaves resources unchanged', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 1, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      t.choose(game, 'Pass')

      expect(game.players.byName('dennis').spice).toBe(1)
      expect(game.state.jessicaMemories.dennis).toBe(0)
    })

    test('no Spice Agony prompt without spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      // Signet ring resolved with no Spice Agony branch — next prompt is the
      // deploy step from Arrakeen's combat space.
      expect(game.waiting?.selectors[0].title).not.toContain('Spice Agony')
    })

    test('no Spice Agony prompt without troops in supply', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 1, troopsInSupply: 0, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      expect(game.waiting?.selectors[0].title).not.toContain('Spice Agony')
    })
  })

  describe('Other Memories (unflipped, BG space)', () => {
    function playSeekAlliesToBG(game) {
      // Seek Allies has all four faction icons and so can target the Secrets
      // (Bene Gesserit) space. Effect-order choice resolves Secrets first so
      // Other Memories' onAgentPlaced fires before deploy.
      t.choose(game, 'Agent Turn.Seek Allies')
      t.choose(game, 'Secrets')
      t.choose(game, 'Secrets')
    }

    test('activation returns memories, draws cards, flips leader', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Seek Allies'], troopsInSupply: 5 },
        jessicaMemories: { dennis: 2 },
      })
      game.run()

      const supplyBefore = game.players.byName('dennis').troopsInSupply
      const handBefore = game.zones.byId('dennis.hand').cardlist().length

      playSeekAlliesToBG(game)
      t.choose(game, 'Return 2 Memories → Draw 2 cards and flip Leader')

      const dennis = game.players.byName('dennis')
      expect(dennis.troopsInSupply).toBe(supplyBefore + 2)
      // Seek Allies left hand (-1) and Other Memories drew 2 cards. The board
      // space itself does not draw cards.
      expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handBefore + 1)
      expect(game.state.jessicaMemories.dennis).toBe(0)
      expect(game.state.jessicaFlipped.dennis).toBe(true)
    })

    test('Pass leaves memories and unflipped', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Seek Allies'] },
        jessicaMemories: { dennis: 1 },
      })
      game.run()

      playSeekAlliesToBG(game)
      t.choose(game, 'Pass')

      expect(game.state.jessicaMemories.dennis).toBe(1)
      expect(game.state.jessicaFlipped.dennis).toBe(false)
    })

    test('zero memories: no prompt', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Seek Allies'] },
      })
      game.run()

      playSeekAlliesToBG(game)
      // No Other Memories prompt offered — game proceeds.
      expect(game.waiting?.selectors[0].title).not.toContain('Other Memories')
      expect(game.state.jessicaFlipped.dennis).toBe(false)
    })
  })

  describe('Water of Life (flipped signet ring)', () => {
    function playSignet(game) {
      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
    }

    test('1 Spice → 1 Water when flipped', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 2, water: 0, hand: ['Signet Ring'] },
        jessicaFlipped: { dennis: true },
      })
      game.run()

      playSignet(game)

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(1)
      expect(dennis.water).toBe(1)
    })

    test('no-op when flipped with 0 spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0, water: 0, hand: ['Signet Ring'] },
        jessicaFlipped: { dennis: true },
      })
      game.run()

      playSignet(game)
      expect(game.players.byName('dennis').water).toBe(0)
    })
  })

  describe('Reverend Mother (flipped, agent placement)', () => {
    test('may pay 1 Water to repeat BG space effects', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { water: 2, hand: ['Seek Allies'] },
        jessicaFlipped: { dennis: true },
      })
      game.run()

      const intrigueBefore = game.zones.byId('dennis.intrigue').cardlist().length

      t.choose(game, 'Agent Turn.Seek Allies')
      t.choose(game, 'Secrets')
      t.choose(game, 'Secrets') // resolve Secrets before Seek Allies
      t.choose(game, 'Pay 1 Water to repeat Secrets effects')

      // 1 water spent for the repeat; Secrets' +1 intrigue effect runs twice.
      expect(game.players.byName('dennis').water).toBe(1)
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(intrigueBefore + 2)
    })
  })
})
