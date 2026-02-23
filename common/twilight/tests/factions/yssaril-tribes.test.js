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
    test.todo('Transparasteel Plating: passed players cannot play action cards during your turn')
    test.todo('Mageon Implants: steal 1 action card from another player')
    test.todo('Deepgloom Executable: share Stall Tactics/Scheming with other players')
  })
})
