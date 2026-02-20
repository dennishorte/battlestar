const t = require('../testutil.js')
const res = require('../res/index.js')
const { Galaxy } = require('../model/Galaxy.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

function findAdjacent(systemId) {
  const temp = t.fixture()
  temp.run()
  const galaxy = new Galaxy(temp)
  return galaxy.getAdjacent(systemId)[0]
}

describe('Promissory Notes', () => {
  describe('Data', () => {
    test('generic promissory notes exist', () => {
      const notes = res.getGenericPromissoryNotes()
      expect(notes.length).toBe(4)
      expect(notes.map(n => n.id)).toContain('support-for-the-throne')
      expect(notes.map(n => n.id)).toContain('ceasefire')
      expect(notes.map(n => n.id)).toContain('trade-agreement')
      expect(notes.map(n => n.id)).toContain('political-favor')
    })

    test('each faction has a promissory note', () => {
      const factions = res.getAllFactions()
      for (const faction of factions) {
        expect(faction.promissoryNote).toBeTruthy()
        expect(faction.promissoryNote.id).toBeTruthy()
        expect(faction.promissoryNote.name).toBeTruthy()
      }
    })
  })

  describe('Initialization', () => {
    test('players start with 4 generic + 1 faction promissory note', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.promissoryNotes.length).toBe(5)

      // Check generic notes
      expect(dennis.hasPromissoryNote('support-for-the-throne')).toBe(true)
      expect(dennis.hasPromissoryNote('ceasefire')).toBe(true)
      expect(dennis.hasPromissoryNote('trade-agreement')).toBe(true)
      expect(dennis.hasPromissoryNote('political-favor')).toBe(true)

      // Check faction note (Sol = military-support)
      expect(dennis.hasPromissoryNote('military-support')).toBe(true)
    })

    test('promissory notes are owned by the player', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      for (const note of dennis.promissoryNotes) {
        expect(note.owner).toBe('dennis')
      }
    })

    test('setBoard can override promissory notes', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [
            { id: 'support-for-the-throne', owner: 'micah' },
          ],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.promissoryNotes.length).toBe(1)
      expect(dennis.promissoryNotes[0].id).toBe('support-for-the-throne')
      expect(dennis.promissoryNotes[0].owner).toBe('micah')
    })
  })

  describe('Trading', () => {
    test('promissory note can be traded in a transaction', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          commodities: 2,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary

      // Dennis offers 1 TG + support for the throne, requests 2 commodities
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: {
          tradeGoods: 1,
          promissoryNotes: [{ id: 'support-for-the-throne', owner: 'dennis' }],
        },
        requesting: { commodities: 2 },
      })
      t.choose(game, 'Accept')

      // Dennis should have lost the note
      const dennis = game.players.byName('dennis')
      expect(dennis.hasPromissoryNote('support-for-the-throne', 'dennis')).toBe(false)
      expect(dennis.tradeGoods).toBe(4)  // 3 - 1 + 2 (commodities → TG)

      // Micah should have the note
      const micah = game.players.byName('micah')
      expect(micah.hasPromissoryNote('support-for-the-throne', 'dennis')).toBe(true)
      expect(micah.tradeGoods).toBe(1)   // received 1 TG
      expect(micah.commodities).toBe(0)  // 2 - 2
    })

    test('promissory note retains original owner after trade', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 1,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 1,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')

      // Dennis offers ceasefire note to micah
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: {
          promissoryNotes: [{ id: 'ceasefire', owner: 'dennis' }],
        },
        requesting: {},
      })
      t.choose(game, 'Accept')

      const micah = game.players.byName('micah')
      const note = micah.promissoryNotes.find(
        n => n.id === 'ceasefire' && n.owner === 'dennis'
      )
      expect(note).toBeTruthy()
      expect(note.owner).toBe('dennis')  // still dennis's note
    })
  })

  describe('Player Methods', () => {
    test('hasPromissoryNote checks by id and optionally owner', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasPromissoryNote('ceasefire')).toBe(true)
      expect(dennis.hasPromissoryNote('ceasefire', 'dennis')).toBe(true)
      expect(dennis.hasPromissoryNote('ceasefire', 'micah')).toBe(false)
    })

    test('removePromissoryNote returns the removed note', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const note = dennis.removePromissoryNote('ceasefire', 'dennis')
      expect(note).toBeTruthy()
      expect(note.id).toBe('ceasefire')
      expect(note.owner).toBe('dennis')
      expect(dennis.hasPromissoryNote('ceasefire')).toBe(false)
    })

    test('removePromissoryNote returns null if not found', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const note = dennis.removePromissoryNote('nonexistent', 'dennis')
      expect(note).toBeNull()
    })
  })
})
