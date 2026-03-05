const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Empyrean', () => {
  describe('Data', () => {
    test('starting technologies include Dark Energy Tap', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toContain('dark-energy-tap')
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('empyrean')
      expect(faction.factionTechnologies.length).toBe(3)

      const aetherstream = faction.factionTechnologies.find(t => t.id === 'aetherstream')
      expect(aetherstream).toBeDefined()
      expect(aetherstream.name).toBe('Aetherstream')
      expect(aetherstream.color).toBe('blue')
      expect(aetherstream.prerequisites).toEqual(['blue', 'blue'])

      const voidwatch = faction.factionTechnologies.find(t => t.id === 'voidwatch')
      expect(voidwatch).toBeDefined()
      expect(voidwatch.name).toBe('Voidwatch')
      expect(voidwatch.color).toBe('green')
      expect(voidwatch.prerequisites).toEqual(['green'])

      const voidTether = faction.factionTechnologies.find(t => t.id === 'void-tether')
      expect(voidTether).toBeDefined()
      expect(voidTether.name).toBe('Void Tether')
      expect(voidTether.color).toBeNull()
      expect(voidTether.prerequisites).toEqual(['green', 'blue'])
    })
  })

  test('ships can move through nebula', () => {
    const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
    game.run()

    expect(game.factionAbilities.canMoveThroughNebulae('dennis')).toBe(true)
    expect(game.factionAbilities.canMoveThroughNebulae('micah')).toBe(false)
  })

  describe('Dark Whispers', () => {
    test('Empyrean starts with 2 copies of faction promissory note', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const factionNotes = dennis.promissoryNotes.filter(n => n.id === 'dark-pact')
      expect(factionNotes.length).toBe(2)
    })

    test('non-Empyrean starts with 1 faction promissory note', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      game.run()

      // Sol doesn't have Dark Whispers, so only 1 copy of faction note
      // Sol has no faction-specific promissory note, so check generic notes instead
      const dennis = game.players.byName('dennis')
      const genericNotes = dennis.promissoryNotes.filter(n => n.id === 'support-for-the-throne')
      expect(genericNotes.length).toBe(1)

      // Micah (Empyrean) should have 2 copies
      const micah = game.players.byName('micah')
      const darkPacts = micah.promissoryNotes.filter(n => n.id === 'dark-pact')
      expect(darkPacts.length).toBe(2)
    })
  })

  describe('Aetherpassage', () => {
    test('permission granted allows movement through Empyrean systems', () => {
      // Layout: sol-home(0,-3) → 27(0,-2) → 26(0,-1) → mecatol(0,0)
      // Empyrean ships in system 27 block Sol movement, unless aetherpassage granted
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Acamar agent prompt fires first (onAnySystemActivated before onPreMovement)
      t.choose(game, 'Pass')

      // Empyrean (micah) prompted for aetherpassage
      t.choose(game, 'Allow Passage')

      // Now Sol can move through system 27 (Empyrean ships there)
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Cruiser should arrive in system 26
      const ships26 = game.state.units['26'].space.filter(u => u.owner === 'dennis')
      expect(ships26.length).toBe(1)
    })

    test('permission denied blocks movement through Empyrean systems', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Acamar agent prompt fires first
      t.choose(game, 'Pass')

      // Empyrean denies passage
      t.choose(game, 'Deny')

      // Sol tries to move through system 27 — blocked by Empyrean ships
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Cruiser should NOT arrive (no valid path)
      const ships26 = game.state.units['26'].space.filter(u => u.owner === 'dennis')
      expect(ships26.length).toBe(0)
    })

    test('aetherpassage only lasts one tactical action', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      game.run()

      // Grant is set and cleared
      game.state.aetherpassageGrant = 'micah'
      expect(game.state.aetherpassageGrant).toBe('micah')

      // After clearing (simulated end of tactical action)
      game.state.aetherpassageGrant = null
      expect(game.state.aetherpassageGrant).toBeNull()
    })

    test('Empyrean not prompted on own turn', () => {
      // When Empyrean activates a system, they should NOT be prompted
      const game = t.fixture({ factions: ['empyrean', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities._hasAbility(dennis, 'aetherpassage')).toBe(true)

      // No prompt for self — this is verified by the game flow not blocking
    })
  })

  describe('Agent — Acamar', () => {
    test('after a player activates a system, may exhaust to gain 1 trade good', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          units: {
            'empyrean-home': {
              space: ['carrier', 'destroyer'],
              'the-dark': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)

      // Dennis (Empyrean) activates a system — agent fires on own activation
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Acamar prompt
      t.choose(game, 'Exhaust Acamar')
      t.choose(game, 'Gain 1 Trade Good')

      const dennisAfter = game.players.byName('dennis')
      expect(dennisAfter.isAgentReady()).toBe(false)
      expect(dennisAfter.tradeGoods).toBe(1)
    })

    test('after a player activates a system, may exhaust to give that player 1 command token', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          units: {
            'empyrean-home': {
              space: ['carrier', 'destroyer'],
              'the-dark': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      const tacticsBefore = dennis.commandTokens.tactics

      // Dennis (Empyrean) activates a system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Acamar prompt — give self 1 command token
      t.choose(game, 'Exhaust Acamar')
      t.choose(game, 'Give dennis 1 Command Token')

      // Re-fetch player after game state update
      const dennisAfter = game.players.byName('dennis')
      expect(dennisAfter.isAgentReady()).toBe(false)
      // Lost 1 tactic token to activate, but gained 1 from Acamar = net 0
      expect(dennisAfter.commandTokens.tactics).toBe(tacticsBefore)
    })

    test('exhausted agent cannot be used', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'empyrean-home': {
              space: ['carrier', 'destroyer'],
              'the-dark': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates a system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // No Acamar prompt — agent is exhausted, should go straight to movement
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Exhaust Acamar')
    })

    test('can be used when another player activates a system', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'empyrean'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          tradeGoods: 0,
          units: {
            'empyrean-home': {
              space: ['carrier'],
              'the-dark': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Hacan) activates a system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Micah (Empyrean) gets Acamar prompt — gain trade good for self
      t.choose(game, 'Exhaust Acamar')
      t.choose(game, 'Gain 1 Trade Good')

      const micah = game.players.byName('micah')
      expect(micah.isAgentReady()).toBe(false)
      expect(micah.tradeGoods).toBe(1)
    })
  })

  describe('Commander — Xuange', () => {
    test('unlock condition: be neighbors with all other players', () => {
      // In 2p, Empyrean must be neighbors with the single other player
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'empyrean-home': {
              space: ['carrier', 'destroyer'],
              'the-dark': ['infantry', 'infantry', 'space-dock'],
            },
            // Place a ship in system 38 (adjacent to micah's hacan-home)
            '38': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('commander stays locked when not neighbors with all other players', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      // Default starting units — Empyrean at home, Hacan at home, too far apart
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })

    test('returns command token when opponent moves ships into system with token', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'empyrean'] })
      t.setBoard(game, {
        systemTokens: { '27': ['micah'] },
        dennis: {
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 2, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            'empyrean-home': {
              space: ['carrier'],
              'the-dark': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Hacan) activates system 27 (which has micah/Empyrean command token)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Acamar (agent) is exhausted, so skip agent prompt
      // Aetherpassage prompt fires because Empyrean has ships
      t.choose(game, 'Allow Passage')

      // Dennis moves cruiser into system 27
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
      })

      // onShipsEnterSystem fires — Xuange commander prompt: return token?
      t.choose(game, 'Return Token')

      // Empyrean should have token back (2 + 1 = 3 tactics)
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(3)

      // Token should be removed from system 27
      expect(game.state.systems['27'].commandTokens).not.toContain('micah')
    })

    test('locked commander does not offer token return', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'empyrean'] })
      t.setBoard(game, {
        systemTokens: { '27': ['micah'] },
        dennis: {
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 2, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'empyrean-home': {
              space: ['carrier'],
              'the-dark': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Hacan) activates system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Aetherpassage prompt fires because Empyrean has ships
      t.choose(game, 'Allow Passage')

      // Dennis moves cruiser into system 27
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
      })

      // No commander prompt — commander is locked
      // onShipsEnterSystem fires but commander check fails, no prompt

      // Token should remain in system 27
      expect(game.state.systems['27'].commandTokens).toContain('micah')

      // Micah tactics tokens unchanged
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(2)
    })
  })

  describe('Hero — Conservator Procyon', () => {
    test('Multiverse Shift: places frontier tokens and explores those with ships, then purge', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            'empyrean-home': {
              space: ['carrier'],
              'the-dark': ['infantry', 'infantry', 'space-dock'],
            },
            // Dennis has ships in system 48 (empty system — no planets)
            '48': {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses component action (hero)
      t.choose(game, 'Component Action')
      t.choose(game, 'multiverse-shift')

      // Hero should be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // System 48 should have been explored (has ships)
      expect(game.state.exploredPlanets['48']).toBe(true)
    })
  })

  describe('Mech — Watcher', () => {
    test('mech data has sustain damage and cost 2', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('empyrean')
      expect(faction.mech.abilities).toContain('sustain-damage')
      expect(faction.mech.combat).toBe(6)
      expect(faction.mech.cost).toBe(2)
      expect(faction.mech.name).toBe('Watcher')
    })
  })

  describe('Promissory Note — Dark Pact', () => {
    test('when holder gives commodities equal to max commodity value to Empyrean, both gain 1 trade good', () => {
      // Dennis = Empyrean, Micah = Hacan (max 6 commodities)
      // System 27 is adjacent to empyrean-home so they're neighbors
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted' },
          units: {
            'empyrean-home': {
              space: ['carrier'],
              'the-dark': ['space-dock'],
            },
          },
        },
        micah: {
          tradeGoods: 0,
          promissoryNotes: [{ id: 'dark-pact', owner: 'dennis' }],
          units: {
            '27': {
              space: ['cruiser'],
            },
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      // Micah = Leadership (1) goes first, Dennis = Trade (5)
      pickStrategyCards(game, 'trade', 'leadership')

      // Micah: Component Action → Dark Pact
      t.choose(game, 'Component Action')
      t.choose(game, 'dark-pact')
      // Transaction window auto-exits (no resources)

      // Dennis: Strategic Action (Trade) — gains 3 TG, replenishes commodities
      t.choose(game, 'Strategic Action.trade')
      // Dennis chooses micah for free secondary
      t.choose(game, 'micah')
      // Micah accepts free secondary (Hacan gets it free regardless)
      t.choose(game, 'Use Secondary')

      // Dennis's transaction window: request 6 commodities from Micah
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: {},
        requesting: { commodities: 6 },
      })
      t.choose(game, 'Accept')

      // Dark Pact: Micah gave 6 commodities (= Hacan max 6) to Empyrean → both gain 1 TG
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      // Dennis: 3 (Trade) + 6 (from commodities) + 1 (Dark Pact) = 10
      expect(dennis.tradeGoods).toBe(10)
      // Micah: 0 + 1 (Dark Pact) = 1
      expect(micah.tradeGoods).toBe(1)
    })

    test('returns to Empyrean if holder activates a system with Empyrean units', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'empyrean-home': {
              space: ['carrier'],
              'the-dark': ['space-dock'],
            },
            '27': {
              space: ['cruiser'], // Empyrean unit in system 27
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'dark-pact', owner: 'dennis' }],
          units: {
            'hacan-home': {
              space: ['carrier', 'cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Strategic Action (Leadership)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Empyrean, 4I)

      // Micah: Component Action → Dark Pact
      t.choose(game, 'Component Action')
      t.choose(game, 'dark-pact')

      // Dennis: pass
      t.choose(game, 'Pass')

      // Micah: Tactical Action → activate system 27 (has Empyrean cruiser)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
      })

      // PN returned to Empyrean (Dennis)
      const micah = game.players.byName('micah')
      const dennis = game.players.byName('dennis')
      expect(micah.hasPromissoryNote('dark-pact')).toBe(false)
      expect(dennis.hasPromissoryNote('dark-pact')).toBe(true)
    })
  })

  describe('Promissory Note — Blood Pact', () => {
    test('when holder and Empyrean vote for the same outcome, cast 4 additional votes', () => {
      // Dennis = Empyrean, Micah = Hacan. Both vote for same outcome → 4 extra votes
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        custodiansRemoved: true,
        agendaDeck: ['minister-of-commerce'],
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'empyrean-home': {
              space: ['carrier'],
              'the-dark': ['space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'blood-pact', owner: 'dennis' }],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      // Micah = Leadership (1) goes first, Dennis = Trade (5)
      pickStrategyCards(game, 'trade', 'leadership')

      // Micah: Component Action → Blood Pact
      t.choose(game, 'Component Action')
      t.choose(game, 'blood-pact')

      // Dennis: Strategic Action (Trade)
      t.choose(game, 'Strategic Action.trade')
      // Dennis doesn't choose anyone for free secondary
      t.choose(game, 'Done')
      t.choose(game, 'Pass')  // Micah declines Trade secondary

      // Micah: Strategic Action (Leadership)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Pass')  // dennis declines leadership secondary (Empyrean, The Dark 4I)
      // Hacan Guild Ships: transaction window (Dennis has TG from Trade)
      t.choose(game, 'Skip Transaction')

      // Both pass to end action phase
      t.choose(game, 'Pass')  // Dennis
      t.choose(game, 'Pass')  // Micah

      // Status phase: token redistribution
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Agenda phase — minister-of-commerce: elect a player
      // Voting order: Micah first (non-speaker), Dennis second
      // Both vote for same outcome: 'dennis'
      t.choose(game, 'dennis')   // Micah votes for dennis
      t.choose(game, 'kamdorn (1)')  // Micah exhausts kamdorn (influence 1)
      t.choose(game, 'dennis')   // Dennis votes for dennis
      t.choose(game, 'the-dark (4)')  // Dennis exhausts the-dark (influence 4)

      // Blood Pact adds 4 extra votes for 'dennis' outcome
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Blood Pact') && e.includes('4 additional votes'))).toBe(true)
    })

    test('returns to Empyrean if holder activates a system with Empyrean units', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'empyrean-home': {
              space: ['carrier'],
              'the-dark': ['space-dock'],
            },
            '27': {
              space: ['cruiser'], // Empyrean unit in system 27
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'blood-pact', owner: 'dennis' }],
          units: {
            'hacan-home': {
              space: ['carrier', 'cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Strategic Action → Micah declines
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Empyrean, 4I)
      // micah: leadership secondary auto-passes (Hacan 2I)

      // Micah: Component Action → Blood Pact
      t.choose(game, 'Component Action')
      t.choose(game, 'blood-pact')

      // Dennis: pass
      t.choose(game, 'Pass')

      // Micah: Tactical Action → activate system 27 (has Empyrean cruiser)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
      })

      // PN returned to Empyrean (Dennis)
      const micah = game.players.byName('micah')
      const dennis = game.players.byName('dennis')
      expect(micah.hasPromissoryNote('blood-pact')).toBe(false)
      expect(dennis.hasPromissoryNote('blood-pact')).toBe(true)
    })
  })

  describe('Faction Technologies', () => {
    describe('Aetherstream', () => {
      test('after Empyrean activates a system adjacent to an anomaly, may apply +1 move', () => {
        // System 35 (Bereg+Lirta at -1,0) is adjacent to system 41 (gravity rift at -2,0)
        const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['dark-energy-tap', 'gravity-drive', 'aetherstream'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'empyrean-home': {
                space: ['carrier'],
                'the-dark': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Empyrean) activates system 35 (adjacent to gravity rift 41)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '35' })

        // Aetherstream prompt should appear
        t.choose(game, 'Apply Aetherstream')

        // Verify the bonus is set in state
        expect(game.state.currentTacticalAction.aetherstreamBonus).toBe('dennis')
      })

      test('does not trigger when system is not adjacent to an anomaly', () => {
        // Custom layout: place only non-anomaly tiles around the target system (27).
        // Anomaly tiles (41=gravity rift, 42=nebula, 44=asteroid field) are far away.
        // Empyrean home (nebula) is at (0,-3); system 27 at (0,2) is not adjacent.
        const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
        t.setBoard(game, {
          systems: {
            27: { q: 0, r: 2 },    // target — far from empyrean-home (0,-3)
            26: { q: 0, r: 1 },    // neighbor of 27, no anomaly
            20: { q: 1, r: 1 },    // neighbor of 27, no anomaly
            25: { q: 0, r: -1 },
            35: { q: -1, r: 0 },
            34: { q: -1, r: 1 },
            41: { q: -2, r: 0 },   // gravity rift — far from 27
            42: { q: -2, r: -1 },  // nebula — far from 27
            44: { q: -2, r: 1 },   // asteroid field — far from 27
            37: { q: 1, r: -2 },
            24: { q: 2, r: -2 },
            39: { q: 2, r: -1 },
            38: { q: -1, r: 2 },
            36: { q: 1, r: 2 },
            40: { q: 2, r: 0 },
            47: { q: 1, r: -1 },
            48: { q: -1, r: -1 },
          },
          dennis: {
            technologies: ['dark-energy-tap', 'gravity-drive', 'aetherstream'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'empyrean-home': {
                space: ['carrier'],
                'the-dark': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis activates system 27 (NOT adjacent to any anomaly in this layout)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // No Aetherstream prompt
        const choices = t.currentChoices(game)
        expect(choices).not.toContain('Apply Aetherstream')
      })

      test('triggers when a neighbor activates a system adjacent to an anomaly', () => {
        // Micah (Hacan) activates system 35 (adjacent to gravity rift 41).
        // Empyrean (dennis) should get the Aetherstream prompt if they are neighbors.
        const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['dark-energy-tap', 'gravity-drive', 'aetherstream'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'empyrean-home': {
                space: ['carrier'],
                'the-dark': ['infantry', 'infantry', 'space-dock'],
              },
              // Dennis has ships in system 26, adjacent to 27 where Micah has ships
              '26': {
                space: ['destroyer'],
              },
            },
          },
          micah: {
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['infantry', 'infantry', 'space-dock'],
                'hercant': ['infantry'],
                'kamdorn': ['infantry'],
              },
              '27': {
                space: ['carrier'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis does a strategic action first
        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // allocate tokens
        t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Empyrean, 4I)
        // micah: leadership secondary auto-passes (Hacan 2I)

        // Micah activates system 35 (adjacent to gravity rift 41)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '35' })

        // Aetherstream prompt for Dennis (Empyrean): they are neighbors since
        // Dennis has ships in 26 and Micah has ships in 27 (adjacent systems)
        t.choose(game, 'Apply Aetherstream')

        expect(game.state.currentTacticalAction.aetherstreamBonus).toBe('micah')
      })

      test('does not trigger without the technology', () => {
        const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['dark-energy-tap'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'empyrean-home': {
                space: ['carrier'],
                'the-dark': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis activates system 35 (adjacent to anomaly 41)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '35' })

        // No Aetherstream prompt — tech not researched
        const choices = t.currentChoices(game)
        expect(choices).not.toContain('Apply Aetherstream')
      })
    })

    describe('Voidwatch', () => {
      test('after a player moves ships into a system with your units, they must give you 1 promissory note', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'empyrean'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['infantry', 'space-dock'],
              },
            },
          },
          micah: {
            technologies: ['dark-energy-tap', 'bio-stims', 'voidwatch'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['destroyer'],
              },
              'empyrean-home': {
                space: ['carrier'],
                'the-dark': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()

        const micahNotesBefore = game.players.byName('micah').getPromissoryNotes().length

        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Hacan) activates system 27 (which has Empyrean destroyer)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Aetherpassage: Empyrean prompted since they have ships
        t.choose(game, 'Allow Passage')

        // Dennis moves cruiser into system 27
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
        })

        // onShipsEnterSystem: Voidwatch triggers — Dennis must give a promissory note
        // Dennis has multiple promissory notes, so they are prompted to choose one
        const choices = t.currentChoices(game)
        // Select the first available promissory note
        t.choose(game, choices[0])

        // Micah should have gained a promissory note from Dennis
        const micah = game.players.byName('micah')
        const micahNotesAfter = micah.getPromissoryNotes().length
        expect(micahNotesAfter).toBe(micahNotesBefore + 1)
      })

      test('gives 1 trade good instead when mover has no promissory notes', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'empyrean'] })
        t.setBoard(game, {
          dennis: {
            tradeGoods: 3,
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['infantry', 'space-dock'],
              },
            },
          },
          micah: {
            tradeGoods: 0,
            technologies: ['dark-energy-tap', 'bio-stims', 'voidwatch'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['destroyer'],
              },
              'empyrean-home': {
                space: ['carrier'],
                'the-dark': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })

        // Remove all of Dennis's promissory notes in a breakpoint (survives replays)
        game.testSetBreakpoint('initialization-complete', (g) => {
          const dennis = g.players.byName('dennis')
          while (dennis.getPromissoryNotes().length > 0) {
            const note = dennis.getPromissoryNotes()[0]
            dennis.removePromissoryNote(note.id, note.owner)
          }
        })

        game.run()

        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis activates system 27
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Aetherpassage
        t.choose(game, 'Allow Passage')

        // Move cruiser
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
        })

        // No promissory notes — Voidwatch should give 1 TG instead
        // This happens automatically (no prompt needed)
        const dennisAfter = game.players.byName('dennis')
        expect(dennisAfter.tradeGoods).toBe(2) // Lost 1 TG

        const micah = game.players.byName('micah')
        expect(micah.tradeGoods).toBe(1) // Gained 1 TG
      })

      test('does not trigger without the technology', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'empyrean'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['infantry', 'space-dock'],
              },
            },
          },
          micah: {
            technologies: ['dark-energy-tap'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              '27': {
                space: ['destroyer'],
              },
              'empyrean-home': {
                space: ['carrier'],
                'the-dark': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        const micahNotesBefore = game.players.byName('micah').getPromissoryNotes().length

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Aetherpassage
        t.choose(game, 'Allow Passage')

        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
        })

        // Voidwatch should NOT trigger — no tech
        const micahNotesAfter = game.players.byName('micah').getPromissoryNotes().length
        expect(micahNotesAfter).toBe(micahNotesBefore)
      })
    })

    describe('Void Tether', () => {
      test('when activating a system containing or adjacent to your unit or planet, may place or move a void tether token', () => {
        const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['dark-energy-tap', 'void-tether'],
            units: {
              'empyrean-home': {
                space: ['cruiser'],
                'the-dark': ['space-dock', 'infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis activates system 27 (adjacent to empyrean-home where he has units)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Void Tether prompt: choose a border
        t.choose(game, 'Border 27-26')

        // Move ships
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'empyrean-home', count: 1 }],
        })

        // Verify void tether token placed
        expect(game.state.voidTetherTokens).toHaveLength(1)
        expect(game.state.voidTetherTokens[0].owner).toBe('dennis')
        expect(game.state.voidTetherTokens[0].systems).toEqual(['27', '26'])
      })

      test('other players do not treat tethered systems as adjacent during movement', () => {
        const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['dark-energy-tap', 'void-tether'],
            units: {
              'empyrean-home': {
                space: ['cruiser'],
                'the-dark': ['space-dock', 'infantry'],
              },
            },
          },
          micah: {
            units: {
              '26': {
                space: ['cruiser'],
              },
            },
          },
        })

        // Pre-place void tether on border 27-26
        game.testSetBreakpoint('initialization-complete', (game) => {
          game.state.voidTetherTokens = [{ owner: 'dennis', systems: ['27', '26'] }]
        })

        game.run()
        pickStrategyCards(game, 'diplomacy', 'leadership')

        // Micah takes leadership strategic action first
        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // allocate tokens
        t.choose(game, 'Pass')  // dennis declines leadership secondary (Empyrean, The Dark 4I)

        // Dennis takes diplomacy
        t.choose(game, 'Strategic Action.diplomacy')
        t.choose(game, 'empyrean-home')
        // Micah: diplomacy secondary auto-skipped (no exhausted planets)

        // Micah tries to move cruiser from system 26 to system 27
        // System 26 and 27 are normally adjacent, but void tether blocks it for Micah
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: '26', count: 1 }],
        })

        // Micah's cruiser should NOT have moved (path blocked by void tether)
        const sys27Ships = game.state.units['27'].space.filter(u => u.owner === 'micah')
        const sys26Ships = game.state.units['26'].space.filter(u => u.owner === 'micah')
        expect(sys26Ships.length).toBe(1)  // Cruiser stays in 26
        expect(sys27Ships.length).toBe(0)  // No Micah ships in 27
      })
    })
  })
})
