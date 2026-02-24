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
    test('after winning space combat, opponent gives 1 promissory note', () => {
      const game = t.fixture({ factions: ['mentak-coalition', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          commandTokens: { tactics: 3, strategy: 2, fleet: 5 },
          units: {
            'mentak-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'moll-primus': ['space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'support-for-the-throne', owner: 'micah' }],
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action — move into system 27 where Micah has 1 fighter
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'mentak-home', count: 5 }],
      })

      // Ambush: Mentak rolls for up to 2 cruisers at start of space combat
      // Combat will proceed — Mentak with 5 cruisers vs 1 fighter should win easily

      // After combat resolves, the game loop continues.
      // The commander promissory note prompt may happen automatically
      // (single note = auto-respond) or we may need to handle it.
      // Let's check what happens after combat.

      // After Mentak wins, S'Ula Mentarion triggers — Micah gives promissory note
      // Since Micah has only 1 note, it should auto-resolve

      // Dennis should now have the promissory note
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      const dennisNotes = dennis.getPromissoryNotes()
      const micahNotes = micah.getPromissoryNotes()

      expect(dennisNotes.some(n => n.id === 'support-for-the-throne')).toBe(true)
      expect(micahNotes.some(n => n.id === 'support-for-the-throne')).toBe(false)
    })

    test('does not trigger when commander is locked', () => {
      const game = t.fixture({ factions: ['mentak-coalition', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          commandTokens: { tactics: 3, strategy: 2, fleet: 5 },
          units: {
            'mentak-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'moll-primus': ['space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'support-for-the-throne', owner: 'micah' }],
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'mentak-home', count: 5 }],
      })

      // After combat resolves, commander is locked — no promissory note transfer
      const micah = game.players.byName('micah')
      const micahNotes = micah.getPromissoryNotes()
      expect(micahNotes.some(n => n.id === 'support-for-the-throne')).toBe(true)
    })
  })

  describe('Hero — Ipswitch, Loose Cannon', () => {
    test('SLEEPER CELL: hero activation sets flag and purges hero at start of combat', () => {
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
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
              space: ['cruiser'],
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

      // Hero prompt at start of space combat
      t.choose(game, 'Activate Sleeper Cell')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Verify Sleeper Cell log
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes('Sleeper Cell'))).toBe(true)
    })

    test('can pass on hero activation', () => {
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
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
              space: ['cruiser'],
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

      // Pass on hero
      t.choose(game, 'Pass')

      // Hero should NOT be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(false)
    })
  })

  describe('Mech — Moll Terminus', () => {
    test.todo("DEPLOY: other players' ground forces on this planet cannot use Sustain Damage")
  })

  describe('Promissory Note — Promise of Protection', () => {
    test.todo('holder is immune to Pillage ability')
    test.todo('returns to Mentak player when holder activates system with Mentak units')
  })

  describe('Faction Technologies', () => {
    test('Salvage Operations: gain 1 trade good after winning space combat', () => {
      // Mentak wins combat with Salvage Operations — gains 1 TG
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          technologies: ['salvage-operations'],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
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

      // Salvage Operations: offered to produce destroyed ship type (fighter), choose Pass
      t.choose(game, 'Pass')

      const dennis = game.players.byName('dennis')
      // Gained 1 TG from Salvage Operations
      expect(dennis.tradeGoods).toBe(1)

      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes('Salvage Operations') && t.includes('trade good'))).toBe(true)
    })

    test('Salvage Operations: produce 1 ship of destroyed type after winning combat', () => {
      // Mentak wins combat, enemy cruiser destroyed — Mentak can produce 1 cruiser
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          technologies: ['salvage-operations'],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
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
              space: ['cruiser'],
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

      // Salvage Operations: produce a cruiser (the destroyed type)
      t.choose(game, 'cruiser')

      const dennisShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis')

      // Started with 5 cruisers, might lose some, but gained 1 from Salvage Operations
      // At minimum should still have ships in system
      expect(dennisShips.length).toBeGreaterThanOrEqual(1)

      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes('Salvage Operations') && t.includes('produces'))).toBe(true)
    })

    test('Salvage Operations: gain 1 trade good even after losing space combat', () => {
      // Mentak loses combat with Salvage Operations — still gains 1 TG
      // Use a single destroyer vs 5 dreadnoughts (Mentak will lose)
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          technologies: ['salvage-operations'],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'mentak-home': {
              space: ['destroyer'],
              'moll-primus': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['dreadnought', 'dreadnought', 'dreadnought', 'dreadnought', 'dreadnought'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'destroyer', from: 'mentak-home', count: 1 }],
      })

      // Mentak loses, but still gets 1 TG from Salvage Operations
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })

    test('Mirror Computing: trade goods worth 2 resources when spent in production', () => {
      // Mentak with Mirror Computing produces units — TG worth 2 resources each
      // Moll Primus has 4 resources; with 2 TG (worth 4 via Mirror Computing) = 8 total
      // Mentak starts with sarween-tools: total cost reduced by 1
      const game = t.fixture({
        factions: ['mentak-coalition', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 2,
          commandTokens: { tactics: 3, strategy: 2, fleet: 5 },
          technologies: ['mirror-computing'],
          units: {
            'mentak-home': {
              'moll-primus': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates home system for production (tactical action)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'mentak-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 4 cruisers (cost 2 each = 8 total, -1 sarween = 7 effective)
      // Planet provides 4 resources, need 3 more from TG
      // With Mirror Computing, ceil(3/2) = 2 TG spent
      // Without Mirror Computing, would need 3 TG (only have 2), so only 3 cruisers
      t.action(game, 'produce-units', {
        units: [
          { type: 'cruiser', count: 4 },
        ],
      })

      const dennisShips = game.state.units['mentak-home'].space
        .filter(u => u.owner === 'dennis')
      const cruiserCount = dennisShips.filter(u => u.type === 'cruiser').length
      // 4 cruisers should have been produced (Mirror Computing makes TG worth 2 each)
      expect(cruiserCount).toBe(4)

      // Verify TG reduced: 2 TG spent
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)
    })

    test.todo("The Table's Grace: Corsair movement through enemy systems with Cruiser II")
  })
})
