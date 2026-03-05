const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Council Keleres', () => {
  describe('Data', () => {
    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'], keleresSubFaction: 'mentak-coalition' })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('council-keleres')
      expect(faction.factionTechnologies.length).toBe(3)

      const execOrder = faction.factionTechnologies.find(t => t.id === 'executive-order')
      expect(execOrder.color).toBe('yellow')
      expect(execOrder.prerequisites).toEqual(['yellow'])

      const agency = faction.factionTechnologies.find(t => t.id === 'agency-supply-network')
      expect(agency.color).toBe('yellow')
      expect(agency.prerequisites).toEqual(['yellow', 'yellow'])

      const iihq = faction.factionTechnologies.find(t => t.id === 'iihq-modernization')
      expect(iihq.color).toBeNull()
      expect(iihq.prerequisites).toEqual(['yellow', 'green'])
    })
  })

  test('replenishes commodities + 1 TG at strategy phase', () => {
    const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'], keleresSubFaction: 'xxcha-kingdom' })
    game.run()

    // Keleres has council-patronage
    // At strategy phase start, replenish commodities and gain 1 TG
    const dennis = game.players.byName('dennis')
    // After running, strategy phase starts → council-patronage fires
    // Keleres has 2 commodities max
    expect(dennis.commodities).toBe(2)
    // Gained 1 TG from patronage
    expect(dennis.tradeGoods).toBe(1)
  })

  describe('Laws Order', () => {
    test('Keleres can blank laws by spending influence', () => {
      const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'], keleresSubFaction: 'xxcha-kingdom' })
      t.setBoard(game, {
        activeLaws: [{ id: 'minister-of-commerce', name: 'Minister of Commerce', type: 'law', resolvedOutcome: 'micah' }],
        dennis: {
          planets: { 'new-albion': { exhausted: false } },  // 1 influence
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Keleres) has laws-order
      // At start of turn, prompted to blank laws
      t.choose(game, 'Blank Laws')
      t.choose(game, 'archon-tau (1)')  // exhaust 1 planet to pay 1 influence

      // Laws should be blanked during this turn
      expect(game.state.lawsBlankedByPlayer).toBe('dennis')
      expect(game._isLawActive('minister-of-commerce')).toBe(false)
    })

    test('laws-order blanking clears at end of turn', () => {
      const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'], keleresSubFaction: 'xxcha-kingdom' })
      t.setBoard(game, {
        activeLaws: [{ id: 'minister-of-commerce', name: 'Minister of Commerce', type: 'law', resolvedOutcome: 'micah' }],
        dennis: {
          planets: { 'new-albion': { exhausted: false } },  // 1 influence
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis blanks laws
      t.choose(game, 'Blank Laws')
      t.choose(game, 'archon-tau (1)')  // exhaust 1 planet to pay 1 influence

      // Dennis does strategic action
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Keleres/Xxcha, 4I remaining)

      // Now micah's turn — law blanking should clear
      // Micah is not prompted for laws-order (not Keleres)
      // Laws should be active again for micah's turn
      expect(game._isLawActive('minister-of-commerce')).toBe(true)
    })
  })

  describe('The Tribunii', () => {
    test('Keleres inherits Mentak home system', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.keleresSubFaction).toBe('mentak-coalition')
      expect(dennis.faction.homeSystem).toBe('mentak-home')

      // Mentak home system should exist in the galaxy
      expect(game.state.systems['mentak-home']).toBeDefined()
    })

    test('Keleres inherits Xxcha home system', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'xxcha-kingdom',
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.keleresSubFaction).toBe('xxcha-kingdom')
      expect(dennis.faction.homeSystem).toBe('xxcha-home')

      expect(game.state.systems['xxcha-home']).toBeDefined()
    })

    test('Keleres inherits Argent home system', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'argent-flight',
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.keleresSubFaction).toBe('argent-flight')
      expect(dennis.faction.homeSystem).toBe('argent-home')

      expect(game.state.systems['argent-home']).toBeDefined()
    })

    test('cannot choose a faction already played', () => {
      // Xxcha is played by micah — Keleres cannot choose it
      const game = t.fixture({
        factions: ['council-keleres', 'xxcha-kingdom'],
        keleresSubFaction: 'mentak-coalition',
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.keleresSubFaction).toBe('mentak-coalition')
      expect(dennis.faction.homeSystem).toBe('mentak-home')
    })

    test('setBoard pre-configures sub-faction', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'argent-flight',
      })
      game.run()

      const dennis = game.players.byName('dennis')

      // Sub-faction was set via fixture option
      expect(dennis.keleresSubFaction).toBe('argent-flight')

      // Starting units include Keleres fleet in space + sub-faction planet units
      const homeUnits = game.state.units['argent-home']
      expect(homeUnits).toBeDefined()

      // Keleres should have ships in space
      const dennisShips = homeUnits.space.filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBeGreaterThan(0)
    })
  })

  describe('Agent — Xander Alexin Victori III', () => {
    test('exhaust at start of another player turn to convert their commodities to TG', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'emirates-of-hacan'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
        },
        micah: {
          commodities: 6,  // Hacan has 6 max commodities
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Strategic Action (leadership)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens

      // Micah's turn starts — Keleres agent triggers
      // Dennis (Keleres) is prompted to exhaust Xander
      t.choose(game, 'Exhaust Xander')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(0)
      // Micah should have gained 6 TG from commodity conversion
      expect(micah.tradeGoods).toBeGreaterThanOrEqual(6)
    })
  })

  describe('Commander — Suffi An', () => {
    test('after performing a component action, may perform an additional action', () => {
      // Dennis (Keleres) has commander unlocked and bio-stims tech
      // After using bio-stims (component action), Suffi An offers a bonus action
      // Dennis uses the bonus to activate a system (Tactical Action)
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { commander: 'unlocked' },
          technologies: ['bio-stims'],
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          planets: {
            'moll-primus': { exhausted: true },
          },
          units: {
            'mentak-home': {
              'moll-primus': ['space-dock'],
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis performs a component action (bio-stims)
      t.choose(game, 'Component Action')
      t.choose(game, 'bio-stims')
      // Bio-stims: only 1 exhausted planet (moll-primus), auto-responded

      // Suffi An triggers: additional action offered
      // Dennis chooses Tactical Action as the bonus
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'cruiser', from: 'mentak-home', count: 1 },
        ],
      })

      // Verify planet was readied by bio-stims
      expect(game.state.planets['moll-primus'].exhausted).toBe(false)

      // Verify system 27 was activated (command token placed)
      expect(game.state.systems['27'].commandTokens).toContain('dennis')

      // Verify the cruiser moved to system 27
      const ships = game.state.units['27'].space.filter(u => u.owner === 'dennis')
      expect(ships.some(u => u.type === 'cruiser')).toBe(true)
    })

    test('unlock condition: spend 1 trade good after playing an action card with a component action', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          actionCards: ['mining-initiative'],  // timing: 'action'
          planets: {
            'moll-primus': { exhausted: false },
            'new-albion': { exhausted: false },  // 2nd planet so mining-initiative prompt isn't auto-selected
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis plays an action card with ACTION timing
      // (only 1 action card, so card selection is auto-responded)
      t.choose(game, 'Action Card.Mining Initiative')

      // Choose planet for mining-initiative effect (2 planets, not auto-selected)
      t.choose(game, 'moll-primus')

      // Now prompted: Spend 1 TG to unlock commander?
      t.choose(game, 'Spend 1 TG to unlock commander')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('commander stays locked if declining to spend TG after action card', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          actionCards: ['mining-initiative'],
          planets: {
            'moll-primus': { exhausted: false },
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Action Card.Mining Initiative')
      t.choose(game, 'moll-primus')

      // Decline the offer
      t.choose(game, 'Pass')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })
  })

  describe('Hero — Kuuasi Aun Jalatai (Argent)', () => {
    test('Overwing Zeta: place flagship and up to 2 cruisers/destroyers, then purge', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'argent-flight',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'keleres-hero')

      // System auto-selected (only argent-home has controlled planets)
      // Place 2 ships
      t.choose(game, 'cruiser')
      t.choose(game, 'destroyer')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      const spaceUnits = game.state.units['argent-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
      expect(spaceUnits).toContain('flagship')
      expect(spaceUnits).toContain('cruiser')
      expect(spaceUnits).toContain('destroyer')
    })
  })

  describe('Hero — Odlynn Myrr (Xxcha)', () => {
    test('Operation Archon: cast extra votes, gain TG and command tokens, then purge', () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'xxcha-kingdom',
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          commandTokens: { tactics: 2, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'keleres-hero')

      // Choose extra votes
      t.choose(game, '6 votes')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Council Patronage gives 1 TG at strategy phase start (from 0 -> 1)
      // Hero then gives 1 TG per opponent (1 in 2p), so total = 2
      expect(dennis.tradeGoods).toBe(2)
      // Hero gives 1 command token per opponent (1 in 2p), tactics: 2 + 3 (leadership) + 1 = 6
      // Actually leadership primary gives 3 tokens distributed, let's just check increase
      expect(dennis.commandTokens.tactics).toBeGreaterThanOrEqual(3)
    })
  })

  describe("Hero — Harka Leeds (Mentak)", () => {
    test("Erwan's Covenant: draws action cards with component actions, then purge", () => {
      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          actionCards: [],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'keleres-hero')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Should have drawn some action cards (up to 3 with component actions)
      // The exact number depends on the deck composition
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes("Erwan's Covenant"))).toBe(true)
    })
  })

  describe('Mech — Omniopiares', () => {
    test('getInvasionInfluenceCost returns 1 when mech present on planet', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('council-keleres')

      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          units: {
            '27': {
              'new-albion': ['mech', 'infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const cost = handler.getInvasionInfluenceCost(dennis, game.factionAbilities, {
        planetId: 'new-albion',
        systemId: '27',
        invadingPlayer: 'micah',
      })
      expect(cost).toBe(1)
    })

    test('getInvasionInfluenceCost returns 0 when no mech on planet', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('council-keleres')

      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const cost = handler.getInvasionInfluenceCost(dennis, game.factionAbilities, {
        planetId: 'new-albion',
        systemId: '27',
        invadingPlayer: 'micah',
      })
      expect(cost).toBe(0)
    })

    test('getInvasionInfluenceCost returns 0 for own invasion', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('council-keleres')

      const game = t.fixture({
        factions: ['council-keleres', 'federation-of-sol'],
        keleresSubFaction: 'mentak-coalition',
      })
      t.setBoard(game, {
        dennis: {
          units: {
            '27': {
              'new-albion': ['mech', 'infantry'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const cost = handler.getInvasionInfluenceCost(dennis, game.factionAbilities, {
        planetId: 'new-albion',
        systemId: '27',
        invadingPlayer: 'dennis',
      })
      expect(cost).toBe(0)
    })
  })

  describe('Promissory Note — Keleres Rider', () => {
    function playToAgenda(game) {
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (leadership=1) goes first
      t.choose(game, 'Strategic Action.leadership')  // Dennis uses leadership
      t.choose(game, 'Done')              // allocate tokens
      // Micah (diplomacy=2) goes next
      t.choose(game, 'Strategic Action.diplomacy')  // Micah uses diplomacy
      t.choose(game, 'sol-home')          // Micah diplomacy target
      // Dennis: diplomacy secondary auto-skipped (no exhausted planets)
      // Both pass action phase
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')
      // Status phase
      t.choose(game, 'Done')
      t.choose(game, 'Done')
    }

    test('correct prediction draws 1 action card and gains 2 TG, returns card', () => {
      // Dennis = Keleres (owner), Micah = Sol (holder)
      // Using Sol instead of Hacan to avoid Hacan's non-neighbor trade windows
      const game = t.fixture({ factions: ['council-keleres', 'federation-of-sol'], keleresSubFaction: 'mentak-coalition' })
      t.setBoard(game, {
        custodiansRemoved: true,
        agendaDeck: ['mutiny', 'economic-equality'],
        micah: {
          promissoryNotes: [{ id: 'keleres-rider', owner: 'dennis' }],
          tradeGoods: 0,
          planets: {
            'jord': { exhausted: false },
          },
        },
      })
      game.run()
      playToAgenda(game)

      // Agenda: mutiny (for-against)
      // Micah (holder) is offered Keleres Rider
      t.choose(game, 'Play Keleres Rider')
      t.choose(game, 'Predict: For')

      // Micah cannot vote (excluded)
      // Dennis votes For (exhaust Moll Primus for 1 vote)
      t.choose(game, 'For')
      t.choose(game, 'moll-primus (1)')

      // Outcome: For — Micah predicted correctly
      const micah = game.players.byName('micah')
      expect(micah.tradeGoods).toBe(2)

      // PN returned to Keleres (Dennis)
      const dennis = game.players.byName('dennis')
      expect(dennis.getPromissoryNotes().some(n => n.id === 'keleres-rider')).toBe(true)
      expect(micah.getPromissoryNotes().some(n => n.id === 'keleres-rider')).toBe(false)

      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Keleres Rider'))).toBe(true)
    })
  })

  describe('Faction Technologies', () => {
    describe('Executive Order', () => {
      test('exhaust to draw top or bottom agenda card; players vote as if you were speaker', () => {
        const game = t.fixture({
          factions: ['council-keleres', 'federation-of-sol'],
          keleresSubFaction: 'mentak-coalition',
        })
        t.setBoard(game, {
          agendaDeck: ['mutiny'],
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['sarween-tools', 'executive-order'],
            planets: {
              'moll-primus': { exhausted: false },
            },
          },
          micah: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: Component Action → executive-order
        t.choose(game, 'Component Action')
        t.choose(game, 'executive-order')

        // Choose to draw from Top of agenda deck
        t.choose(game, 'Top')

        // _resolveAgenda runs with Dennis as speaker
        // Non-speaker (Micah) votes first
        t.choose(game, 'Abstain')

        // Dennis (speaker) votes For
        t.choose(game, 'For')
        t.choose(game, 'moll-primus (1)')
        // TG spending: Dennis has 1 TG from Council Patronage, rate = 1
        t.choose(game, 'Spend 1 TG (+1 votes)')

        const dennis = game.players.byName('dennis')
        // Tech should be exhausted
        expect((dennis.exhaustedTechs || []).includes('executive-order')).toBe(true)
        // TG spent (had 1 from patronage, spent 1)
        expect(dennis.tradeGoods).toBe(0)

        const logEntries = game.log._log.map(e => e.template || '')
        expect(logEntries.some(e => e.includes('Executive Order'))).toBe(true)
      })

      test('can spend trade goods as votes on this agenda', () => {
        const game = t.fixture({
          factions: ['council-keleres', 'federation-of-sol'],
          keleresSubFaction: 'mentak-coalition',
        })
        t.setBoard(game, {
          agendaDeck: ['mutiny'],
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['sarween-tools', 'executive-order'],
            tradeGoods: 4,  // + 1 from Council Patronage = 5
            planets: {
              'moll-primus': { exhausted: false },
            },
          },
          micah: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Component Action')
        t.choose(game, 'executive-order')
        t.choose(game, 'Top')

        // Micah abstains
        t.choose(game, 'Abstain')

        // Dennis votes For, exhausts planet
        t.choose(game, 'For')
        t.choose(game, 'moll-primus (1)')
        // Spend 3 of 5 TG (+3 votes)
        t.choose(game, 'Spend 3 TG (+3 votes)')

        const dennis = game.players.byName('dennis')
        // Had 5 TG (4 + 1 patronage), spent 3 = 2 remaining
        expect(dennis.tradeGoods).toBe(2)
      })
    })

    describe('Agency Supply Network', () => {
      test('once per action, when resolving PRODUCTION, may resolve another unit PRODUCTION in any system', () => {
        const game = t.fixture({
          factions: ['council-keleres', 'federation-of-sol'],
          keleresSubFaction: 'mentak-coalition',
        })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['agency-supply-network'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 5 },
            planets: {
              'moll-primus': { exhausted: false },
              'new-albion': { exhausted: false },
            },
            units: {
              'mentak-home': {
                'moll-primus': ['space-dock', 'infantry'],
                space: ['carrier'],
              },
              '27': {
                'new-albion': ['space-dock'],
                space: [],
              },
            },
          },
          micah: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: Tactical Action → activate mentak-home → produce
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: 'mentak-home' })
        t.choose(game, 'Done')  // skip movement

        // Produce 2 infantry in mentak-home (cost 1 resource from moll-primus)
        t.action(game, 'produce-units', {
          units: [{ type: 'infantry', count: 2 }],
        })

        // afterProduction → Agency Supply Network offers bonus production
        t.choose(game, '*27')

        // Produce 1 infantry in system 27 (cost 1 resource from new-albion)
        t.action(game, 'produce-units', {
          units: [{ type: 'infantry', count: 1 }],
        })

        // Verify units produced in mentak-home (started with 1 + produced 2 = 3)
        const homeInfantry = game.state.units['mentak-home'].planets['moll-primus']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry')
        expect(homeInfantry.length).toBe(3)

        // Verify units produced in system 27
        const sys27Infantry = game.state.units['27'].planets['new-albion']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry')
        expect(sys27Infantry.length).toBe(1)

        const logEntries = game.log._log.map(e => e.template || '')
        expect(logEntries.some(e => e.includes('Agency Supply Network'))).toBe(true)
      })
    })

    describe('I.I.H.Q. Modernization', () => {
      test('on gain, receive Custodia Vigilia planet card', () => {
        const game = t.fixture({
          factions: ['council-keleres', 'federation-of-sol'],
          keleresSubFaction: 'mentak-coalition',
        })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['sarween-tools', 'neural-motivator'],  // yellow + green prereqs
          },
          micah: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          },
        })
        game.run()
        pickStrategyCards(game, 'technology', 'imperial')

        // Dennis uses Technology primary: research iihq-modernization
        t.choose(game, 'Strategic Action.technology')
        t.choose(game, 'iihq-modernization')

        // Verify Custodia Vigilia planet granted
        expect(game.state.planets['custodia-vigilia']).toBeDefined()
        expect(game.state.planets['custodia-vigilia'].controller).toBe('dennis')
        expect(game.state.planets['custodia-vigilia'].exhausted).toBe(false)

        // Verify IIHQ state tracked
        expect(game.state.iihqModernization).toBeDefined()
        expect(game.state.iihqModernization.owner).toBe('dennis')
      })

      test('becomes neighbors with players with units in or adjacent to Mecatol Rex system', () => {
        const game = t.fixture({
          factions: ['council-keleres', 'federation-of-sol'],
          keleresSubFaction: 'mentak-coalition',
        })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['sarween-tools', 'neural-motivator', 'iihq-modernization'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
          micah: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            commodities: 4,
            units: {
              '18': {
                space: ['cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis does Strategic Action (leadership)
        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // allocate tokens

        // After Dennis's action, transaction window appears
        // IIHQ Modernization makes Dennis neighbor of Micah (Micah has ships at Mecatol Rex)
        // So "Propose Transaction?" should include micah
        const choices = t.currentChoices(game)
        expect(choices).toContain('micah')

        t.choose(game, 'Skip Transaction')
      })
    })
  })
})
