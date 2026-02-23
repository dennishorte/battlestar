const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Mentak Coalition', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['mentak-coalition', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['sarween-tools', 'plasma-scoring']))
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['mentak-coalition', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('mentak-coalition')
      expect(faction.factionTechnologies.length).toBe(3)

      const salvage = faction.factionTechnologies.find(t => t.id === 'salvage-operations')
      expect(salvage.color).toBe('yellow')
      expect(salvage.prerequisites).toEqual(['yellow', 'yellow'])
      expect(salvage.unitUpgrade).toBeNull()

      const mirror = faction.factionTechnologies.find(t => t.id === 'mirror-computing')
      expect(mirror.color).toBe('yellow')
      expect(mirror.prerequisites).toEqual(['yellow', 'yellow', 'yellow'])
      expect(mirror.unitUpgrade).toBeNull()

      const grace = faction.factionTechnologies.find(t => t.id === 'the-tables-grace')
      expect(grace.color).toBeNull()
      expect(grace.prerequisites).toEqual(['yellow', 'green'])
      expect(grace.unitUpgrade).toBeNull()
    })
  })

  describe('Ambush', () => {
    test('Mentak ambush fires before combat and can destroy ships', () => {
      // Mentak (dennis) moves cruisers into system with enemy fighter
      // Ambush rolls 1 die per cruiser/destroyer (up to 2) using ship combat value
      // Deterministic layout: mentak-home (0,-3) -> adjacent to system 27 (0,-2)
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          units: {
            'mentak-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'moll-primus': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'mentak-home', count: 5 }],
      })

      // 5 cruisers vs 1 fighter — Mentak should win (ambush + combat)
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('Ambush does not fire when Mentak has no cruisers or destroyers', () => {
      // Mentak only has carriers (no cruisers/destroyers), so Ambush should not trigger
      // We verify via log: no "Ambush" message should appear
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          units: {
            'mentak-home': {
              space: ['carrier'],
              'moll-primus': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'carrier', from: 'mentak-home', count: 1 }],
      })

      // Check that no Ambush log message was generated
      const logEntries = game.log._log.map(e => e.template || '')
      const ambushLogs = logEntries.filter(t => t.includes('Ambush'))
      expect(ambushLogs.length).toBe(0)
    })
  })

  describe('Pillage', () => {
    test('Mentak can steal trade good from neighbor after transaction', () => {
      // 3 players: Sol (dennis), Hacan (micah), Mentak (scott)
      // Sol and Hacan trade while adjacent to Mentak — Mentak pillages
      // 3p uses random layout (deterministic only applies to 2p)
      // Use a setup game to find an adjacent system
      const { Galaxy } = require('../../model/Galaxy.js')
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      const setupGame = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const solAdj = galaxy.getAdjacent('sol-home')[0]

      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 5,
          units: {
            // Place Hacan adjacent to Sol so they can trade
            [solAdj]: { space: ['cruiser'] },
          },
        },
        scott: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted' },
          units: {
            // Place Mentak adjacent to Sol so pillage triggers
            [solAdj]: { space: ['cruiser'] },
          },
        },
      })
      game.run()

      // 3-player strategy: snake draft
      t.choose(game, 'leadership')    // dennis
      t.choose(game, 'diplomacy')     // micah
      t.choose(game, 'trade')         // scott
      t.choose(game, 'construction')  // scott (2nd pick)
      t.choose(game, 'politics')      // micah (2nd pick)
      t.choose(game, 'warfare')       // dennis (2nd pick)

      // Dennis (leadership=1) goes first
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Pass')  // scott declines secondary

      // Dennis should get transaction window (adjacent to micah via solAdj)
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      // Mentak (scott) should be prompted to pillage micah (who now has 6 TG >= 3)
      // Scott steals 1 trade good from micah
      t.choose(game, 'Steal Trade Good')
      // Agent is exhausted, so no agent prompt

      const scott = game.players.byName('scott')
      expect(scott.tradeGoods).toBe(1)
    })

    test('Pillage does not trigger when target has fewer than 3 trade goods', () => {
      // 3 players: Sol (dennis), Hacan (micah), Mentak (scott)
      // Micah starts with only 2 TG, receives 0 from trade (just commodities)
      // After transaction micah has 2 TG — below the 3 TG threshold
      const { Galaxy } = require('../../model/Galaxy.js')
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      const setupGame = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const solAdj = galaxy.getAdjacent('sol-home')[0]

      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 1,
          units: {
            [solAdj]: { space: ['cruiser'] },
          },
        },
        scott: {
          tradeGoods: 0,
          units: {
            [solAdj]: { space: ['cruiser'] },
          },
        },
      })
      game.run()

      // 3-player strategy: snake draft
      t.choose(game, 'leadership')    // dennis
      t.choose(game, 'diplomacy')     // micah
      t.choose(game, 'trade')         // scott
      t.choose(game, 'construction')  // scott (2nd pick)
      t.choose(game, 'politics')      // micah (2nd pick)
      t.choose(game, 'warfare')       // dennis (2nd pick)

      // Dennis (leadership=1) goes first
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Pass')  // scott declines secondary

      // Dennis trades 1 TG to micah — micah now has 2 TG (below 3 threshold)
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      // Mentak should NOT be prompted to pillage (micah only has 2 TG)
      // Game should continue without a Pillage prompt — scott still has 0 TG
      const scott = game.players.byName('scott')
      expect(scott.tradeGoods).toBe(0)
    })
  })

  describe('Agent — Suffi An', () => {
    test('exhaust after Pillage to draw 1 action card each', () => {
      // 3 players: Sol (dennis), Hacan (micah), Mentak (scott)
      // After pillaging, Mentak agent offers to draw 1 action card each
      // Dennis starts with 2 TG (below 3 threshold) so only micah is pillage-eligible
      const { Galaxy } = require('../../model/Galaxy.js')
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      const setupGame = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const solAdj = galaxy.getAdjacent('sol-home')[0]

      t.setBoard(game, {
        dennis: {
          tradeGoods: 2,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 5,
          units: {
            [solAdj]: { space: ['cruiser'] },
          },
        },
        scott: {
          tradeGoods: 0,
          leaders: { agent: 'ready' },
          units: {
            [solAdj]: { space: ['cruiser'] },
          },
        },
      })
      game.run()

      // 3-player strategy: snake draft
      t.choose(game, 'leadership')    // dennis
      t.choose(game, 'diplomacy')     // micah
      t.choose(game, 'trade')         // scott
      t.choose(game, 'construction')  // scott (2nd pick)
      t.choose(game, 'politics')      // micah (2nd pick)
      t.choose(game, 'warfare')       // dennis (2nd pick)

      // Dennis (leadership=1) goes first
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Pass')  // scott declines secondary

      // Dennis trades 1 TG to micah — micah now has 6 TG (>= 3 threshold)
      // Dennis has 1 TG left (below 3 threshold) so no pillage prompt for dennis
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      // Mentak (scott) pillages micah (the only eligible target)
      t.choose(game, 'Steal Trade Good')

      // Agent prompt: exhaust Suffi An to draw 1 action card each
      t.choose(game, 'Exhaust Suffi An')

      // Re-fetch players after game state changes
      const scott = game.players.byName('scott')
      const micah = game.players.byName('micah')

      expect(scott.tradeGoods).toBe(1)
      expect(scott.leaders.agent).toBe('exhausted')
      expect(scott.actionCards.length).toBe(1)
      expect(micah.actionCards.length).toBe(1)
    })

    test('agent is not offered when already exhausted', () => {
      // Same setup but with agent already exhausted — no prompt after pillage
      const { Galaxy } = require('../../model/Galaxy.js')
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      const setupGame = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const solAdj = galaxy.getAdjacent('sol-home')[0]

      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 5,
          units: {
            [solAdj]: { space: ['cruiser'] },
          },
        },
        scott: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted' },
          units: {
            [solAdj]: { space: ['cruiser'] },
          },
        },
      })
      game.run()

      // 3-player strategy: snake draft
      t.choose(game, 'leadership')    // dennis
      t.choose(game, 'diplomacy')     // micah
      t.choose(game, 'trade')         // scott
      t.choose(game, 'construction')  // scott (2nd pick)
      t.choose(game, 'politics')      // micah (2nd pick)
      t.choose(game, 'warfare')       // dennis (2nd pick)

      // Dennis (leadership=1) goes first
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Pass')  // scott declines secondary

      // Dennis trades 1 TG to micah
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { tradeGoods: 1 },
        requesting: {},
      })
      t.choose(game, 'Accept')

      // Mentak (scott) pillages micah — no agent prompt since exhausted
      t.choose(game, 'Steal Trade Good')

      const scott = game.players.byName('scott')
      expect(scott.tradeGoods).toBe(1)
      expect(scott.leaders.agent).toBe('exhausted')
      // No action cards drawn since agent was exhausted
      expect(scott.actionCards?.length || 0).toBe(0)
    })
  })

  describe("Commander — S'Ula Mentarion", () => {
    test.todo('after winning space combat, force opponent to give 1 promissory note')
  })

  describe('Hero — Ipswitch, Loose Cannon', () => {
    test.todo('SLEEPER CELL: at start of space combat, purge to place copies of destroyed enemy ships')
  })

  describe('Mech — Moll Terminus', () => {
    test.todo("DEPLOY: other players' ground forces on this planet cannot use Sustain Damage")
  })

  describe('Promissory Note — Promise of Protection', () => {
    test.todo('holder is immune to Pillage ability')
    test.todo('returns to Mentak player when holder activates system with Mentak units')
  })

  describe('Faction Technologies', () => {
    test.todo('Salvage Operations: gain 1 trade good after winning or losing space combat')
    test.todo('Salvage Operations: produce 1 ship of destroyed type after winning combat')
    test.todo('Mirror Computing: trade goods worth 2 resources or influence when spent')
    test.todo("The Table's Grace: Corsair movement through enemy systems with Cruiser II")
  })
})
