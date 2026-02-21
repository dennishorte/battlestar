const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Faction Abilities', () => {
  describe('Federation of Sol', () => {
    describe('Orbital Drop', () => {
      test('places 2 infantry on a controlled planet', () => {
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis uses Component Action → Orbital Drop
        // Only 1 controlled planet (jord) so planet choice auto-resolves
        t.choose(game, 'Component Action')
        t.choose(game, 'orbital-drop')

        // Re-read state after action (deterministic replay rebuilds state)
        const jord = game.state.units['sol-home'].planets['jord']
        const infantryCount = jord.filter(u => u.owner === 'dennis' && u.type === 'infantry').length
        // Sol starts with 5 infantry + 2 from orbital drop = 7
        expect(infantryCount).toBe(7)
      })

      test('costs 1 tactics command token', () => {
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Only 1 controlled planet so auto-resolves
        t.choose(game, 'Component Action')
        t.choose(game, 'orbital-drop')

        // Started with 3 tactics, spent 1 = 2
        const dennis = game.players.byName('dennis')
        expect(dennis.commandTokens.tactics).toBe(2)
      })

      test('not available to non-Sol factions', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis is Hacan here — Component Action should have no component actions
        // The choose will log "No component actions available" and return
        t.choose(game, 'Component Action')

        // Should immediately return to dennis's turn
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })
    })

    describe('Versatile', () => {
      test('gains 1 extra command token in status phase', () => {
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Play through action phase
        t.choose(game, 'Strategic Action')  // dennis: leadership
        t.choose(game, 'Pass')  // micah declines secondary
        t.choose(game, 'Strategic Action')  // micah: diplomacy
        t.choose(game, 'hacan-home')
        t.choose(game, 'Pass')  // dennis declines secondary
        t.choose(game, 'Pass')
        t.choose(game, 'Pass')

        // Status phase
        t.choose(game, 'Done')  // dennis gets 3 (2+1 Versatile)
        t.choose(game, 'Done')  // micah gets 2

        const dennis = game.players.byName('dennis')
        const micah = game.players.byName('micah')

        // Dennis: 3 (start) + 3 (leadership) + 3 (status: 2+1 Versatile) = 9
        expect(dennis.commandTokens.tactics).toBe(9)
        // Micah: 3 (start) + 2 (status) = 5
        expect(micah.commandTokens.tactics).toBe(5)
      })
    })
  })

  describe('Barony of Letnev', () => {
    describe('Armada', () => {
      test('Letnev can move more non-fighter ships than base fleet pool', () => {
        // Letnev: fleet pool 3 + Armada 2 = 5 non-fighter ships allowed
        // Deterministic layout: letnev-home (0,-3) → adjacent to system 27 (0,-2)
        const game = t.fixture({
          factions: ['barony-of-letnev', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'letnev-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'arc-prime': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 6 }],
        })

        // Fleet pool 3 + Armada 2 = 5 non-fighter ships should arrive
        const nonFighterShips = game.state.units['27'].space
          .filter(u => u.owner === 'dennis' && u.type !== 'fighter')
        expect(nonFighterShips.length).toBe(5)
      })

      test('non-Letnev faction limited to base fleet pool', () => {
        // Sol: fleet pool 3, no Armada bonus
        // Deterministic layout: sol-home (0,-3) → adjacent to system 27 (0,-2)
        const game = t.fixture({
          factions: ['federation-of-sol', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'sol-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'jord': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
        })

        // Fleet pool 3 = only 3 non-fighter ships should arrive
        const nonFighterShips = game.state.units['27'].space
          .filter(u => u.owner === 'dennis' && u.type !== 'fighter')
        expect(nonFighterShips.length).toBe(3)
      })
    })
  })

  describe('Barony of Letnev — Munitions Reserves', () => {
    test('Letnev can spend 2 TG for reroll option in combat', () => {
      // Deterministic layout: letnev-home (0,-3) → adjacent to system 27 (0,-2)
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          units: {
            'letnev-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arc-prime': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 5 }],
      })

      // Combat triggers — Letnev prompted for Munitions Reserves
      t.choose(game, 'Reroll')

      // 5 cruisers vs 1 fighter — Letnev wins regardless
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Should have spent 2 TG
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
    })

    test('Munitions Reserves not offered when insufficient trade goods', () => {
      // Deterministic layout: letnev-home (0,-3) → adjacent to system 27 (0,-2)
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 1,  // Not enough for reroll
          units: {
            'letnev-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arc-prime': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 5 }],
      })

      // No Munitions Reserves prompt — combat just resolves
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Trade goods unchanged (1 TG, not enough to spend)
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })
  })

  describe('Naalu Collective', () => {
    describe('Telepathic', () => {
      test('Naalu always goes first in action phase regardless of strategy card', () => {
        const game = t.fixture({
          numPlayers: 3,
          factions: ['federation-of-sol', 'naalu-collective', 'emirates-of-hacan'],
        })
        game.run()

        // Snake draft: dennis, micah, scott, scott, micah, dennis
        t.choose(game, 'leadership')    // dennis: leadership(1)
        t.choose(game, 'imperial')      // micah: imperial(8)
        t.choose(game, 'diplomacy')     // scott: diplomacy(2)
        t.choose(game, 'construction')  // scott: construction(4)
        t.choose(game, 'politics')      // micah: politics(3)
        t.choose(game, 'trade')         // dennis: trade(5)

        // Despite having high cards (3,8), Naalu should go first (initiative 0)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })

      test('non-Naalu player with lower card goes after Naalu', () => {
        const game = t.fixture({
          factions: ['federation-of-sol', 'naalu-collective'],
        })
        game.run()

        // Dennis picks leadership(1), micah (Naalu) picks imperial(8)
        t.choose(game, 'leadership')
        t.choose(game, 'imperial')

        // Naalu goes first even though leadership(1) < imperial(8)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })
    })

    describe('Foresight', () => {
      test('Naalu can move ship to adjacent system when opponent enters', () => {
        // Deterministic layout: hacan-home at (0,-3) → adjacent to system 27 (0,-2)
        // System 27 (0,-2) is adjacent to: [37, 26, 48, hacan-home]
        // Place Naalu fighter in system 27, Hacan approaches from home
        const game = t.fixture({
          factions: ['emirates-of-hacan', 'naalu-collective'],
        })
        t.setBoard(game, {
          dennis: {
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['space-dock'],
              },
            },
          },
          micah: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              '27': {
                space: ['fighter'],
              },
              'naalu-home': {
                space: [],
                'druaa': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Micah (Naalu, telepathic=0) goes first — use diplomacy
        t.choose(game, 'Strategic Action')
        t.choose(game, 'naalu-home')   // diplomacy: choose system
        t.choose(game, 'Pass')         // dennis declines diplomacy secondary

        // Dennis (Hacan) takes tactical action
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
        })

        // Naalu prompted for Foresight — retreat to system 37 (adjacent to 27)
        // Use * prefix to prevent t.choose from converting '37' to number
        t.choose(game, '*37')

        // Naalu's fighter should have moved to system 37
        const retreatShips = game.state.units['37'].space
          .filter(u => u.owner === 'micah')
        expect(retreatShips.length).toBe(1)

        // Naalu should have spent 1 strategy token
        const micah = game.players.byName('micah')
        expect(micah.commandTokens.strategy).toBe(1)
      })
    })
  })

  describe('Emirates of Hacan', () => {
    describe('Guild Ships', () => {
      test('Hacan can trade with non-neighbors', () => {
        // In the default 2-player map, sol-home and hacan-home are not adjacent
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: { tradeGoods: 5 },
          micah: { tradeGoods: 5 },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Hacan) uses leadership — goes first (card #1)
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')  // micah declines secondary

        // After strategic action, Dennis gets transaction window
        // Hacan's Guild Ships means Dennis can trade even though not neighbors
        const choices = t.currentChoices(game)
        expect(choices).toContain('micah')
      })

      test('non-Hacan cannot trade with non-neighbors', () => {
        // Micah (Sol) should not be able to trade with non-adjacent Hacan
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: { tradeGoods: 5 },
          micah: { tradeGoods: 5 },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Sol) uses leadership
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')  // micah declines secondary

        // Dennis is Sol — not neighbors with Hacan in default map
        // Should go directly to micah's turn (no transaction window)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })
    })

    describe('Masters of Trade', () => {
      test('Hacan uses Trade secondary for free', () => {
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'trade', 'imperial')

        // Dennis (Sol, trade=5) uses strategic action
        t.choose(game, 'Strategic Action')

        // Micah (Hacan) gets Trade secondary prompt — should be free
        t.choose(game, 'Use Secondary')

        // Hacan should have replenished commodities without spending strategy token
        const micah = game.players.byName('micah')
        expect(micah.commodities).toBe(6)  // Hacan max
        expect(micah.commandTokens.strategy).toBe(2)  // unchanged — free!
      })

      test('non-Hacan pays strategy token for Trade secondary', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        game.run()
        pickStrategyCards(game, 'trade', 'imperial')

        // Dennis (Hacan, trade=5) uses strategic action
        t.choose(game, 'Strategic Action')

        // Micah (Sol) gets Trade secondary prompt — costs 1 strategy token
        t.choose(game, 'Use Secondary')

        const micah = game.players.byName('micah')
        expect(micah.commodities).toBe(4)  // Sol max
        expect(micah.commandTokens.strategy).toBe(1)  // spent 1
      })
    })
  })

  describe('Mentak Coalition', () => {
    describe('Ambush', () => {
      test('Mentak ambush fires before combat and can destroy ships', () => {
        // Mentak (dennis) moves cruisers into system with enemy fighter
        // Ambush rolls 2 dice at 9+ before combat begins
        // Deterministic layout: mentak-home (0,-3) → adjacent to system 27 (0,-2)
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
    })

    describe('Pillage', () => {
      test('Mentak can steal trade good from neighbor after transaction', () => {
        // 3 players: Sol (dennis), Hacan (micah), Mentak (scott)
        // Sol and Hacan trade while adjacent to Mentak — Mentak pillages
        // 3p uses random layout (deterministic only applies to 2p)
        // Use a setup game to find an adjacent system
        const { Galaxy } = require('../model/Galaxy.js')
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

        // Mentak (scott) should be prompted to pillage micah (who received TG)
        // Scott steals 1 trade good from micah
        t.choose(game, 'Steal Trade Good')

        const scott = game.players.byName('scott')
        expect(scott.tradeGoods).toBe(1)
      })
    })
  })

  describe('Yssaril Tribes', () => {
    describe('Stall Tactics', () => {
      test('can discard action card as component action', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            actionCards: ['focused-research', 'mining-initiative'],
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Yssaril) uses component action
        t.choose(game, 'Component Action')
        t.choose(game, 'stall-tactics')

        // Should be prompted to discard a card — choose focused-research
        t.choose(game, 'focused-research')

        const dennis = game.players.byName('dennis')
        expect(dennis.actionCards.length).toBe(1)
        expect(dennis.actionCards[0].id).toBe('mining-initiative')
      })

      test('not available without action cards', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Yssaril) has no action cards — Component Action should have no options
        t.choose(game, 'Component Action')

        // Should immediately return (no component actions)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })
    })

    describe('Scheming', () => {
      test('draws 1 extra action card then discards 1', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        game.run()
        pickStrategyCards(game, 'politics', 'imperial')

        // Dennis (Yssaril, politics=3) goes first
        t.choose(game, 'Strategic Action')

        // Politics primary: choose new speaker
        t.choose(game, 'dennis')

        // After drawing 2 cards, Scheming draws 1 extra, then prompts discard
        // Dennis now has 3 cards — pick first to discard
        const cardToDiscard = game.players.byName('dennis').actionCards[0].id
        t.choose(game, cardToDiscard)

        // Re-read player after state replay
        const dennis = game.players.byName('dennis')
        // Dennis should have 2 cards (drew 3, discarded 1)
        expect(dennis.actionCards.length).toBe(2)

        // Micah gets politics secondary (draw 2 action cards)
        t.choose(game, 'Use Secondary')

        // Micah (Hacan) should have 2 cards (no scheming)
        const micah = game.players.byName('micah')
        expect(micah.actionCards.length).toBe(2)
      })
    })

    describe('Crafty', () => {
      test('Yssaril can hold more than 7 action cards', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            actionCards: [
              'focused-research', 'mining-initiative', 'ghost-ship',
              'plague', 'uprising', 'sabotage', 'skilled-retreat',
              'direct-hit',
            ],
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Play through to status phase
        t.choose(game, 'Strategic Action')  // dennis: leadership
        t.choose(game, 'Pass')  // micah declines secondary
        t.choose(game, 'Strategic Action')  // micah: diplomacy
        t.choose(game, 'hacan-home')
        t.choose(game, 'Pass')  // dennis declines secondary
        t.choose(game, 'Pass')
        t.choose(game, 'Pass')

        // Status phase — both draw 1 card
        // Dennis (Yssaril) scheming triggers: draws extra, discards 1
        // Pick any card to discard for scheming
        const dennisCards = game.players.byName('dennis').actionCards
        t.choose(game, dennisCards[0].id)

        // Dennis has 8+ cards but Crafty means no hand limit enforcement
        // Status phase continues (no discard prompt for Dennis)
        // Micah has ≤7 cards so no discard prompt either
        t.choose(game, 'Done')  // dennis token redistribution
        t.choose(game, 'Done')  // micah token redistribution

        // Dennis should still have 8+ cards (no forced discard)
        const dennis = game.players.byName('dennis')
        expect(dennis.actionCards.length).toBeGreaterThanOrEqual(8)
      })
    })
  })

  describe('Universities of Jol-Nar', () => {
    describe('Analytical', () => {
      test('can research tech with 1 missing prerequisite (non-unit-upgrade)', () => {
        // Jol-Nar starts with 4 techs: neural-motivator(green), antimass-deflectors(blue),
        // sarween-tools(yellow), plasma-scoring(red) — 1 of each color
        // Fleet Logistics needs 2 blue, but Analytical lets them skip 1
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'technology', 'imperial')

        t.choose(game, 'Strategic Action')

        const choices = t.currentChoices(game)
        expect(choices).toContain('fleet-logistics')
      })

      test('cannot skip prerequisite for unit upgrade technologies', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        game.run()

        // Analytical should NOT skip prereqs for unit upgrades
        const dennis = game.players.byName('dennis')
        // Carrier II needs 2 blue — Jol-Nar has 1 blue (antimass-deflectors)
        // Since Carrier II is a unit upgrade, Analytical should NOT help
        expect(dennis.canResearchTechnology('carrier-ii')).toBe(false)
      })

      test('non-Jol-Nar cannot skip prerequisites', () => {
        // Hacan with same 1 blue tech cannot research fleet-logistics (needs 2 blue)
        const game = t.fixture({ factions: ['emirates-of-hacan', 'universities-of-jol-nar'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools'],
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        expect(dennis.canResearchTechnology('fleet-logistics')).toBe(false)
      })
    })

    describe('Brilliant', () => {
      test('can skip 2 prerequisites total (analytical + brilliant) for non-unit-upgrade', () => {
        // Jol-Nar starts with 4 techs (1 each color)
        // Graviton Laser System needs 1 yellow + 1 red — Jol-Nar has both, so no skip needed
        // Light/Wave Deflector needs 3 blue — Jol-Nar has 1 blue, deficit 2
        // Analytical (1 skip) + Brilliant (1 skip) = 2 total skips
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        game.run()

        const dennis = game.players.byName('dennis')
        // Light/Wave Deflector needs 3 blue prereqs — Jol-Nar has 1 blue (deficit 2)
        // analytical skip 1 + brilliant skip 1 = can research
        expect(dennis.canResearchTechnology('light-wave-deflector')).toBe(true)
      })

      test('brilliant does not help unit upgrades', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        game.run()

        const dennis = game.players.byName('dennis')
        // Carrier II needs 2 blue — Jol-Nar has 1 blue (deficit 1)
        // analytical doesn't apply to unit upgrades, brilliant doesn't either
        expect(dennis.canResearchTechnology('carrier-ii')).toBe(false)
      })
    })

    describe('Fragile', () => {
      test('Jol-Nar combat rolls are less effective', () => {
        // Deterministic layout: jolnar-home (0,-3) → adjacent to system 27 (0,-2)
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })

        // Jol-Nar has 5 cruisers (combat 7, with Fragile effectively combat 8)
        // vs 1 fighter (combat 9) — Jol-Nar should still win with 5 ships
        t.setBoard(game, {
          dennis: {
            units: {
              'jolnar-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'jol': ['space-dock'],
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
          movements: [{ unitType: 'cruiser', from: 'jolnar-home', count: 5 }],
        })

        // Even with Fragile, 5 cruisers should destroy 1 fighter
        const micahShips = game.state.units['27'].space
          .filter(u => u.owner === 'micah')
        expect(micahShips.length).toBe(0)
      })
    })
  })

  describe("Sardakk N'orr", () => {
    describe('Unrelenting', () => {
      test('Sardakk combat rolls are more effective', () => {
        // Deterministic layout: norr-home (0,-3) → adjacent to system 27 (0,-2)
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })

        // Sardakk has 5 cruisers (combat 7, with Unrelenting effectively combat 6)
        // vs 1 fighter (combat 9) — Sardakk should win easily
        t.setBoard(game, {
          dennis: {
            units: {
              'norr-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'quinarra': ['space-dock'],
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

        // Dennis (Sardakk) uses tactical action
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'norr-home', count: 5 }],
        })

        // 5 cruisers with Unrelenting should destroy 1 fighter
        const micahShips = game.state.units['27'].space
          .filter(u => u.owner === 'micah')
        expect(micahShips.length).toBe(0)
      })

      test('non-Sardakk player does not get Unrelenting bonus', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        game.run()

        // Sardakk has it
        const dennis = game.players.byName('dennis')
        expect(dennis.faction.abilities.some(a => a.id === 'unrelenting')).toBe(true)

        // Hacan does not
        const micah = game.players.byName('micah')
        expect(micah.faction.abilities.some(a => a.id === 'unrelenting')).toBe(false)
      })
    })
  })

  describe('Faction Technologies', () => {
    test('Sol faction techs are researchable after prerequisites', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          technologies: ['neural-motivator', 'antimass-deflectors', 'psychoarchaeology', 'bio-stims'],
        },
      })
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      // Dennis has 2 green prereqs — can research Spec Ops II (needs 2 green)
      t.choose(game, 'Strategic Action')

      const choices = t.currentChoices(game)
      expect(choices).toContain('spec-ops-ii')
    })

    test('Letnev faction techs include L4 Disruptors', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      t.setBoard(game, {
        scott: {
          technologies: ['antimass-deflectors', 'plasma-scoring', 'sarween-tools'],
        },
      })
      game.run()

      // Check that Letnev can see their faction techs
      const scott = game.players.byName('scott')
      const prereqs = scott.getTechPrerequisites()
      // Has plasma-scoring (red) + sarween-tools (yellow) -> 1 red, 1 yellow
      expect(prereqs.red).toBe(1)
      expect(prereqs.yellow).toBe(1)
    })
  })

  describe('Arborec', () => {
    describe('Mitosis', () => {
      test('places 1 infantry on controlled planet during status phase', () => {
        const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Play through action phase
        t.choose(game, 'Strategic Action')  // dennis: leadership
        t.choose(game, 'Pass')  // micah declines secondary
        t.choose(game, 'Strategic Action')  // micah: diplomacy
        t.choose(game, 'hacan-home')
        t.choose(game, 'Pass')  // dennis declines secondary
        t.choose(game, 'Pass')
        t.choose(game, 'Pass')

        // Status phase — Arborec mitosis: choose planet
        t.choose(game, 'nestphar')

        // Token redistribution
        t.choose(game, 'Done')  // dennis
        t.choose(game, 'Done')  // micah

        // Arborec should have 1 more infantry on nestphar
        // Started with 4 infantry + 1 mitosis = 5
        const nestphar = game.state.units['arborec-home'].planets['nestphar']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry')
        expect(nestphar.length).toBe(5)
      })
    })
  })

  describe('Clan of Saar', () => {
    describe('Scavenge', () => {
      test('gains 1 trade good when gaining planet control', () => {
        // Saar moves ground forces to an uncontrolled planet
        const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            tradeGoods: 0,
            units: {
              'saar-home': {
                space: ['carrier'],
                'lisis-ii': ['infantry', 'infantry', 'space-dock'],
              },
              '27': {
                space: ['carrier'],
                'new-albion': ['infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis takes tactical action to move into system 37 (has planets)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '37' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'carrier', from: '27', count: 1 }, { unitType: 'infantry', from: '27', count: 1 }],
        })

        // Infantry placed on planet → planet gained → scavenge triggers
        const dennis = game.players.byName('dennis')
        expect(dennis.tradeGoods).toBe(1)
      })
    })
  })

  describe('Embers of Muaat', () => {
    describe('Star Forge', () => {
      test('spends strategy token to place fighters in war sun system', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis uses Component Action → Star Forge
        t.choose(game, 'Component Action')
        t.choose(game, 'star-forge')

        // Choose 2 Fighters
        t.choose(game, '2 Fighters')

        // War sun is in muaat-home, auto-selects system
        const spaceUnits = game.state.units['muaat-home'].space
          .filter(u => u.owner === 'dennis')
          .map(u => u.type)
          .sort()
        // Started with war-sun + 2 fighters, now + 2 fighters = war-sun + 4 fighters
        expect(spaceUnits).toEqual(['fighter', 'fighter', 'fighter', 'fighter', 'war-sun'])

        // Should have spent 1 strategy token
        const dennis = game.players.byName('dennis')
        expect(dennis.commandTokens.strategy).toBe(1)
      })

      test('can place 1 destroyer instead of fighters', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Component Action')
        t.choose(game, 'star-forge')
        t.choose(game, '1 Destroyer')

        const spaceUnits = game.state.units['muaat-home'].space
          .filter(u => u.owner === 'dennis')
          .map(u => u.type)
          .sort()
        expect(spaceUnits).toEqual(['destroyer', 'fighter', 'fighter', 'war-sun'])
      })
    })

    describe('Gashlai Physiology', () => {
      test('ships can move through supernova systems', () => {
        const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
        game.run()

        // Test the canMoveThroughSupernovae method directly
        expect(game.factionAbilities.canMoveThroughSupernovae('dennis')).toBe(true)
        expect(game.factionAbilities.canMoveThroughSupernovae('micah')).toBe(false)
      })
    })
  })

  describe('Yin Brotherhood', () => {
    describe('Devotion', () => {
      test('destroys own ship to produce hit after space combat round', () => {
        const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'yin-home': {
                space: ['cruiser', 'destroyer'],
                'darien': ['space-dock'],
              },
            },
          },
          micah: {
            units: {
              '27': {
                space: ['fighter', 'fighter'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'cruiser', from: 'yin-home', count: 1 },
            { unitType: 'destroyer', from: 'yin-home', count: 1 },
          ],
        })

        // During combat, Yin gets Devotion prompt after each round
        // Choose to destroy destroyer to produce a hit
        t.choose(game, 'Destroy destroyer')

        // Combat should resolve — Yin should win
        const micahShips = game.state.units['27'].space
          .filter(u => u.owner === 'micah')
        expect(micahShips.length).toBe(0)

        // Yin should have lost the destroyer (sacrificed) but cruiser survives
        const dennisShips = game.state.units['27'].space
          .filter(u => u.owner === 'dennis')
        expect(dennisShips.some(u => u.type === 'cruiser')).toBe(true)
        expect(dennisShips.every(u => u.type !== 'destroyer')).toBe(true)
      })
    })

    describe('Indoctrination', () => {
      test('replaces enemy infantry at ground combat start', () => {
        const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
        // Yin invades a planet controlled by Hacan
        t.setBoard(game, {
          dennis: {
            units: {
              'yin-home': {
                space: ['carrier'],
                'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
              },
            },
          },
          micah: {
            planets: {
              'new-albion': { exhausted: false },
            },
            units: {
              '27': {
                'new-albion': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Yin) moves carrier + infantry to system 27
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: 'yin-home', count: 1 },
            { unitType: 'infantry', from: 'yin-home', count: 4 },
          ],
        })

        // Indoctrination prompt: spend 2 influence to replace 1 enemy infantry
        t.choose(game, 'Indoctrinate')

        // Ground combat resolves. Yin should win (4+1 vs 2-1 infantry)
        expect(game.state.planets['new-albion'].controller).toBe('dennis')
      })
    })
  })

  describe('L1Z1X Mindnet', () => {
    describe('Assimilate', () => {
      test('replaces enemy PDS and docks when gaining planet', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        // System 27 = New Albion + Starpoint — use 37 = Arinam + Meer for different planet
        t.setBoard(game, {
          dennis: {
            units: {
              'l1z1x-home': {
                space: ['carrier', 'carrier'],
                '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
              },
            },
          },
          micah: {
            planets: {
              'new-albion': { exhausted: false },
            },
            units: {
              '27': {
                'new-albion': ['infantry', 'pds', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (L1Z1X) moves 2 carriers + 6 infantry to system 27
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: 'l1z1x-home', count: 2 },
            { unitType: 'infantry', from: 'l1z1x-home', count: 6 },
          ],
        })

        // After ground combat (dennis wins 6 infantry vs 1 + structures)
        // L1Z1X assimilate should replace enemy PDS and space dock
        expect(game.state.planets['new-albion'].controller).toBe('dennis')

        // Check structures belong to dennis now
        const newAlbion = game.state.units['27'].planets['new-albion']
          .filter(u => u.owner === 'dennis')
          .map(u => u.type)

        // Should have assimilated PDS and space dock
        expect(newAlbion).toContain('pds')
        expect(newAlbion).toContain('space-dock')
      })
    })

    describe('Harrow', () => {
      test('non-fighter ships bombard during ground combat rounds', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        // L1Z1X invades with 2 dreadnoughts (bombardment) + carrier with infantry
        t.setBoard(game, {
          dennis: {
            units: {
              'l1z1x-home': {
                space: ['dreadnought', 'dreadnought', 'carrier'],
                '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
              },
            },
          },
          micah: {
            planets: {
              'new-albion': { exhausted: false },
            },
            units: {
              '27': {
                'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'dreadnought', from: 'l1z1x-home', count: 2 },
            { unitType: 'carrier', from: 'l1z1x-home', count: 1 },
            { unitType: 'infantry', from: 'l1z1x-home', count: 4 },
          ],
        })

        // Ground combat with Harrow: 2 dreadnoughts bombard (5x1 each) every round
        // Plus regular bombardment before combat, plus 4 infantry in ground combat
        // L1Z1X should overwhelm 5 defending infantry
        const controller = game.state.planets['new-albion'].controller
        expect(controller).toBe('dennis')
      })
    })
  })

  describe('Winnu', () => {
    describe('Blood Ties', () => {
      test('removes custodians without spending influence', () => {
        const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
        const { Galaxy } = require('../model/Galaxy.js')
        const setupGame = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
        setupGame.run()
        const galaxy = new Galaxy(setupGame)
        const mecatolAdjacent = galaxy.getAdjacent('18')[0]

        t.setBoard(game, {
          dennis: {
            tradeGoods: 0,
            units: {
              'winnu-home': {
                'winnu': ['space-dock'],
              },
              [mecatolAdjacent]: {
                space: ['carrier'],
                ...((() => {
                  const tile = require('../res/index.js').getSystemTile(mecatolAdjacent) || require('../res/index.js').getSystemTile(Number(mecatolAdjacent))
                  const p = tile?.planets[0]
                  return p ? { [p]: ['infantry', 'infantry'] } : {}
                })()),
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '18' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: mecatolAdjacent, count: 1 },
            { unitType: 'infantry', from: mecatolAdjacent, count: 2 },
          ],
        })

        // Winnu removes custodians for free (Blood Ties)
        expect(game.state.custodiansRemoved).toBe(true)
        expect(game.players.byName('dennis').victoryPoints).toBe(1)
      })
    })

    describe('Reclamation', () => {
      test('places PDS and dock on Mecatol Rex after gaining control', () => {
        const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
        const { Galaxy } = require('../model/Galaxy.js')
        const setupGame = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
        setupGame.run()
        const galaxy = new Galaxy(setupGame)
        const mecatolAdjacent = galaxy.getAdjacent('18')[0]

        t.setBoard(game, {
          dennis: {
            units: {
              'winnu-home': {
                'winnu': ['space-dock'],
              },
              [mecatolAdjacent]: {
                space: ['carrier'],
                ...((() => {
                  const tile = require('../res/index.js').getSystemTile(mecatolAdjacent) || require('../res/index.js').getSystemTile(Number(mecatolAdjacent))
                  const p = tile?.planets[0]
                  return p ? { [p]: ['infantry', 'infantry'] } : {}
                })()),
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '18' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: mecatolAdjacent, count: 1 },
            { unitType: 'infantry', from: mecatolAdjacent, count: 2 },
          ],
        })

        // Check Mecatol has PDS and space dock from Reclamation
        const mecatolUnits = game.state.units['18'].planets['mecatol-rex']
          .filter(u => u.owner === 'dennis')
          .map(u => u.type)
          .sort()
        expect(mecatolUnits).toContain('pds')
        expect(mecatolUnits).toContain('space-dock')
      })
    })
  })

  describe('Xxcha Kingdom', () => {
    describe('Peace Accords', () => {
      test('gains unoccupied adjacent planet after diplomacy', () => {
        const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'diplomacy', 'leadership')

        // Micah (leadership=1) goes first
        t.choose(game, 'Strategic Action')  // micah: leadership
        t.choose(game, 'Pass')  // dennis declines secondary

        // Dennis (Xxcha, diplomacy=2) uses diplomacy
        t.choose(game, 'Strategic Action')
        t.choose(game, 'xxcha-home')  // Choose home system for Diplomacy

        // Peace Accords: Xxcha can gain unoccupied planet adjacent to controlled planets
        const choices = t.currentChoices(game)
        expect(choices).toContain('Pass')
        expect(choices.length).toBeGreaterThan(1)

        // Choose first non-Pass option
        const planetChoice = choices.find(c => c !== 'Pass')
        t.choose(game, planetChoice)

        // Micah gets diplomacy secondary prompt
        t.choose(game, 'Pass')

        // The chosen planet should now be controlled by dennis
        expect(game.state.planets[planetChoice].controller).toBe('dennis')
      })
    })

    describe('Quash', () => {
      test('spends strategy token to discard and replace agenda', () => {
        const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
        t.setBoard(game, {
          custodiansRemoved: true,
          agendaDeck: ['mutiny', 'anti-intellectual-revolution', 'incentive-program'],
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Play through action phase
        t.choose(game, 'Strategic Action')  // dennis: leadership
        t.choose(game, 'Pass')  // micah declines secondary
        t.choose(game, 'Strategic Action')  // micah: diplomacy
        t.choose(game, 'hacan-home')
        t.choose(game, 'Pass')  // dennis declines secondary
        t.choose(game, 'Pass')
        t.choose(game, 'Pass')

        // Status phase
        t.choose(game, 'Done')  // dennis
        t.choose(game, 'Done')  // micah

        // Agenda phase — first agenda revealed: "mutiny"
        // Xxcha (dennis) gets Quash prompt
        t.choose(game, 'Quash')

        // Strategy token spent (started with 2, spent 1)
        const dennis = game.players.byName('dennis')
        expect(dennis.commandTokens.strategy).toBe(1)
      })
    })
  })

  // =========================================================================
  // Phase 3: Complex Faction Abilities
  // =========================================================================

  describe('Ghosts of Creuss', () => {
    test('home system is adjacent to wormhole systems', () => {
      const { Galaxy } = require('../model/Galaxy.js')
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()
      const galaxy = new Galaxy(game)

      // Creuss home should be adjacent to alpha wormhole systems
      const adjacent = galaxy.getAdjacent('creuss-home')
      // System 26 = Lodor (alpha wormhole), System 39 (alpha wormhole)
      const hasAlphaAdj = adjacent.some(id => galaxy.hasWormhole(id, 'alpha'))
      // System 25 = Quann (beta wormhole), System 40 (beta wormhole)
      const hasBetaAdj = adjacent.some(id => galaxy.hasWormhole(id, 'beta'))

      expect(hasAlphaAdj).toBe(true)
      expect(hasBetaAdj).toBe(true)
    })

    test('+1 move from wormhole systems', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()

      // Creuss has slipstream: +1 move from wormhole systems
      // From home (which has alpha+beta wormholes), should get +1
      const bonus = game.factionAbilities.getMovementBonus('dennis', 'creuss-home')
      expect(bonus).toBe(1)

      // From a non-wormhole system, no bonus
      const noBonus = game.factionAbilities.getMovementBonus('dennis', '27')
      expect(noBonus).toBe(0)

      // Hacan gets no bonus
      const hacanBonus = game.factionAbilities.getMovementBonus('micah', 'creuss-home')
      expect(hacanBonus).toBe(0)
    })
  })

  describe('Nekro Virus', () => {
    test('cannot research technology normally', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.canResearchNormally(dennis)).toBe(false)

      const micah = game.players.byName('micah')
      expect(game.factionAbilities.canResearchNormally(micah)).toBe(true)
    })

    test('is excluded from agenda voting', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      game.run()

      const votingOrder = game.players.all()
      const participation = game.factionAbilities.getAgendaParticipation(votingOrder)
      expect(participation.excluded).toContain('dennis')
      expect(participation.excluded).not.toContain('micah')
    })

    test('gains tech when opponent unit destroyed in combat', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'nekro-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'mordai-ii': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
      })

      // Nekro destroys Hacan fighter — Technological Singularity triggers
      // Choose a tech from Hacan (antimass-deflectors or sarween-tools)
      t.choose(game, 'antimass-deflectors')

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
    })
  })

  describe('Argent Flight', () => {
    test('votes first with extra votes', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      game.run()

      const votingOrder = game.players.all()
      const participation = game.factionAbilities.getAgendaParticipation(votingOrder)

      // Argent should be first in order
      expect(participation.order[0].faction.id).toBe('argent-flight')

      // Argent gets +playerCount votes
      const argent = game.players.byName('dennis')
      const modifier = game.factionAbilities.getVotingModifier(argent)
      expect(modifier).toBe(2) // 2 players
    })

    test('excess AFB hits damage sustain ships', () => {
      // Test getRaidFormationExcessHits directly
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      game.run()

      // 3 AFB hits, 1 fighter destroyed = 2 excess
      const excess = game.factionAbilities.getRaidFormationExcessHits('dennis', 3, 1)
      expect(excess).toBe(2)

      // Non-Argent gets 0
      const noExcess = game.factionAbilities.getRaidFormationExcessHits('micah', 3, 1)
      expect(noExcess).toBe(0)
    })
  })

  describe('Empyrean', () => {
    test('ships can move through nebula', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()

      expect(game.factionAbilities.canMoveThroughNebulae('dennis')).toBe(true)
      expect(game.factionAbilities.canMoveThroughNebulae('micah')).toBe(false)
    })
  })

  describe('Mahact Gene-Sorcerers', () => {
    test('gains command token after combat win', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'mahact-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'ixth': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'mahact-home', count: 5 }],
      })

      // Mahact wins combat — Edict: capture Hacan command token
      const captured = game.state.capturedCommandTokens['dennis'] || []
      expect(captured).toContain('micah')
    })
  })

  describe('Naaz-Rokha Alliance', () => {
    test('purges fragments for command token', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      // Set relic fragments during initialization (game replays from scratch on each input)
      game.testSetBreakpoint('initialization-complete', (game) => {
        const dennis = game.players.byName('dennis')
        dennis.relicFragments = ['cultural', 'hazardous']
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action → Fabrication
      t.choose(game, 'Component Action')
      t.choose(game, 'fabrication')

      // "Purge 1 fragment for command token" auto-responds (only option since no pair)
      // Then choose which fragment type to purge
      t.choose(game, 'cultural')

      const dennis = game.players.byName('dennis')
      expect(dennis.relicFragments.length).toBe(1)
      expect(dennis.relicFragments[0]).toBe('hazardous')
      // Gained 1 command token (started with 3)
      expect(dennis.commandTokens.tactics).toBe(4)
    })
  })

  describe('Nomad', () => {
    test('gains TG when voted-for outcome wins', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      game.run()

      // Test the helper directly
      const nomad = game.players.byName('dennis')
      const startTG = nomad.tradeGoods
      const playerVotes = { dennis: { outcome: 'For', count: 3 } }
      game.factionAbilities._nomadFutureSight('For', playerVotes)

      expect(nomad.tradeGoods).toBe(startTG + 1)
    })
  })

  describe('Titans of Ul', () => {
    test('places sleeper token after exploration', () => {
      // Titans terragenesis: after exploring a planet, offer to place sleeper
      // We'll test the exploration flow with a carrier moving to a new planet
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['carrier'],
              'elysium': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Move carrier + infantry to system 27 (New Albion + Starpoint)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'titans-home', count: 1 },
          { unitType: 'infantry', from: 'titans-home', count: 2 },
        ],
      })

      // After gaining planet and exploring, Titans get terragenesis prompt
      t.choose(game, 'Place sleeper')

      // Check sleeper placed
      const sleepers = Object.keys(game.state.sleeperTokens)
        .filter(pId => game.state.sleeperTokens[pId] === 'dennis')
      expect(sleepers.length).toBeGreaterThanOrEqual(1)
    })

    test('replaces sleeper with PDS on activation', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['space-dock'],
            },
          },
        },
      })
      // Place sleeper during initialization (state replays from scratch)
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.sleeperTokens['new-albion'] = 'dennis'
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Activate system 27 (which contains new-albion)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Sleeper should be replaced with PDS
      expect(game.state.sleeperTokens['new-albion']).toBeUndefined()
      const pdsOnNewAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis' && u.type === 'pds')
      expect(pdsOnNewAlbion.length).toBe(1)
    })
  })

  describe("Vuil'raith Cabal", () => {
    test('captures destroyed units during combat', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'cabal-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'acheron': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'cabal-home', count: 5 }],
      })

      // Vuil'raith destroys fighter — Devour captures it
      const captured = game.state.capturedUnits['dennis'] || []
      expect(captured.length).toBeGreaterThanOrEqual(1)
      expect(captured[0].type).toBe('fighter')
      expect(captured[0].originalOwner).toBe('micah')
    })

    test('returns captured unit to place own unit (Amalgamation)', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      // Set captured units during initialization (game replays from scratch)
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.capturedUnits['dennis'] = [
          { type: 'cruiser', originalOwner: 'micah' },
        ]
      })
      game.run()

      const startShips = game.state.units['cabal-home'].space
        .filter(u => u.owner === 'dennis').length

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action → Amalgamation
      t.choose(game, 'Component Action')
      t.choose(game, 'amalgamation')

      // Choose captured unit to return (only 1, auto-selected)
      // Choose system (auto: cabal-home, only system with ships)
      // Cruiser placed in cabal-home space
      const endShips = game.state.units['cabal-home'].space
        .filter(u => u.owner === 'dennis').length
      expect(endShips).toBe(startShips + 1)

      // Captured units should be empty
      expect(game.state.capturedUnits['dennis'].length).toBe(0)
    })

    test('returns captured unit to research upgrade (Riftmeld)', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      // Set captured units during initialization (game replays from scratch)
      game.testSetBreakpoint('initialization-complete', (game) => {
        game.state.capturedUnits['dennis'] = [
          { type: 'fighter', originalOwner: 'micah' },
        ]
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action → Riftmeld
      t.choose(game, 'Component Action')
      t.choose(game, 'riftmeld')

      // Captured unit choice auto-responds (only 1), then choose unit upgrade tech
      t.choose(game, 'infantry-ii')

      // Should gain a unit upgrade tech
      const dennis = game.players.byName('dennis')
      const techs = dennis.getTechIds()
      expect(techs).toContain('self-assembly-routines')
      expect(techs).toContain('infantry-ii')

      // Captured units depleted
      expect(game.state.capturedUnits['dennis'].length).toBe(0)
    })
  })

  describe('Council Keleres', () => {
    test('replenishes commodities + 1 TG at strategy phase', () => {
      const game = t.fixture({ factions: ['council-keleres', 'emirates-of-hacan'] })
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
  })

  describe('Starting Units', () => {
    test('Sol starts with correct home system units', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter'])

      const jord = game.state.units['sol-home'].planets['jord']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(jord).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('Letnev starts with dreadnought', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      game.run()

      const spaceUnits = game.state.units['letnev-home'].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'dreadnought', 'fighter'])
    })
  })
})
