const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Yssaril Tribes', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['neural-motivator']))
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('yssaril-tribes')
      expect(faction.factionTechnologies.length).toBe(3)
      expect(faction.factionTechnologies.map(t => t.id).sort()).toEqual(
        ['deepgloom-executable', 'mageon-implants', 'transparasteel-plating']
      )
    })
  })

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

      t.choose(game, 'Component Action')
      t.choose(game, 'stall-tactics')
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

      t.choose(game, 'Component Action')
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

      t.choose(game, 'Strategic Action')
      t.choose(game, 'dennis')

      const cardToDiscard = game.players.byName('dennis').actionCards[0].id
      t.choose(game, cardToDiscard)

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(2)

      t.choose(game, 'Use Secondary')

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

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Scheming: pick card to discard
      const dennisCards = game.players.byName('dennis').actionCards
      t.choose(game, dennisCards[0].id)

      t.choose(game, 'Done')
      t.choose(game, 'Done')

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBeGreaterThanOrEqual(8)
    })
  })

  describe('Agent — Ssruu', () => {
    test.todo('has text ability of each other player agent')
  })

  describe('Commander — So Ata', () => {
    test.todo('look at opponent action cards/notes/secrets when they activate system with your units')
  })

  describe('Hero — Kyver, Blade and Key', () => {
    test.todo('Guild of Spies: see and take/discard opponent action cards, then purge')
  })

  describe('Mech — Blackshade Infiltrator', () => {
    test.todo('DEPLOY: after Stall Tactics, place 1 mech on controlled planet')
  })

  describe('Promissory Note — Spy Net', () => {
    test.todo('at start of turn, look at Yssaril hand and take 1 card')
  })

  describe('Faction Technologies', () => {
    describe('Mageon Implants', () => {
      test('steal 1 action card from another player', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['mageon-implants'],
            actionCards: ['focused-research'],
          },
          micah: {
            actionCards: ['mining-initiative', 'ghost-ship'],
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Component Action')
        t.choose(game, 'mageon-implants')

        // Opponent auto-selects (only 1 opponent in 2p game)
        // Choose card to steal
        t.choose(game, 'mining-initiative')

        const dennis = game.players.byName('dennis')
        expect(dennis.actionCards.length).toBe(2)
        expect(dennis.actionCards.map(c => c.id)).toContain('mining-initiative')

        const micah = game.players.byName('micah')
        expect(micah.actionCards.length).toBe(1)
        expect(micah.actionCards[0].id).toBe('ghost-ship')

        // Tech should be exhausted
        expect(dennis.exhaustedTechs).toContain('mageon-implants')
      })

      test('not available when exhausted', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['mageon-implants'],
            actionCards: ['focused-research'],
          },
          micah: {
            actionCards: ['mining-initiative', 'ghost-ship'],
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // First use — steals a card
        t.choose(game, 'Component Action')
        t.choose(game, 'mageon-implants')
        // Opponent auto-selects (1 opponent in 2p)
        // Choose which card to take
        t.choose(game, 'mining-initiative')

        // Tech should be exhausted after use
        const dennis = game.players.byName('dennis')
        expect(dennis.exhaustedTechs).toContain('mageon-implants')

        // Verify mageon-implants is not in the available component actions
        const actions = game.factionAbilities.getAvailableComponentActions(dennis)
        const mageonAction = actions.find(a => a.id === 'mageon-implants')
        expect(mageonAction).toBeUndefined()
      })
    })

    describe('Transparasteel Plating', () => {
      test('passive ability is registered', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['transparasteel-plating'],
          },
        })
        game.run()

        // Verify the handler has the ability method
        const { getHandler } = require('../../systems/factions/index.js')
        const handler = getHandler('yssaril-tribes')
        const dennis = game.players.byName('dennis')
        expect(handler.canPassedPlayersPlayActionCards(dennis)).toBe(false)
      })

      test('returns true without the tech', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        game.run()

        const { getHandler } = require('../../systems/factions/index.js')
        const handler = getHandler('yssaril-tribes')
        const dennis = game.players.byName('dennis')
        expect(handler.canPassedPlayersPlayActionCards(dennis)).toBe(true)
      })
    })

    test.todo('Deepgloom Executable: share Stall Tactics/Scheming with other players')
  })
})
