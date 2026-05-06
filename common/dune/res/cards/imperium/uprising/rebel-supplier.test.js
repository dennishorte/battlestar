'use strict'

const t = require('../../../../testutil')
const card = require('./rebel-supplier.js')

describe("rebel-supplier", () => {
  test('data', () => {
    expect(card.id).toBe("rebel-supplier")
    expect(card.name).toBe("Rebel Supplier")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
    expect(card.factionAffiliation).toBe('fremen')
    expect(card.agentIcons).toEqual(['purple'])
  })

  test('agent ability: no recalled spy → no troop gain', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Rebel Supplier'] },
    })
    game.run()

    const dennis0 = game.players.byName('dennis')
    const garrisonBefore = dennis0.troopsInGarrison

    t.choose(game, 'Agent Turn.Rebel Supplier')
    t.choose(game, 'Spice Refinery')
    let choices = t.currentChoices(game)
    if (choices.includes('Rebel Supplier')) {
      t.choose(game, 'Rebel Supplier')
    }
    choices = t.currentChoices(game)
    if (choices.includes('Gain 2 Solari')) {
      t.choose(game, 'Gain 2 Solari')
    }
    choices = t.currentChoices(game)
    const deploy = choices.find(c => c.startsWith('Deploy 0'))
    if (deploy) {
      t.choose(game, deploy)
    }

    const dennis = game.players.byName('dennis')
    // Conditional fails → no extra troops from card.
    expect(dennis.troopsInGarrison).toBe(garrisonBefore)
  })

  test('agent ability: recalled spy via Gather Intelligence → +2 Troops', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Post A connects to Spice Refinery. Recall via Gather Intelligence.
      spyPosts: { A: ['dennis'] },
      dennis: { handExact: ['Rebel Supplier'], spiesInSupply: 2 },
    })
    game.run()

    const dennis0 = game.players.byName('dennis')
    const garrisonBefore = dennis0.troopsInGarrison

    t.choose(game, 'Agent Turn.Rebel Supplier')
    t.choose(game, 'Spice Refinery')
    // Gather Intelligence prompt: Yes recalls the spy + sets recalledSpy.
    t.choose(game, 'Yes — recall Spy to draw a card')
    // Resolve order between card and space — pick card first so the troop
    // gain happens unambiguously.
    let choices = t.currentChoices(game)
    if (choices.includes('Rebel Supplier')) {
      t.choose(game, 'Rebel Supplier')
    }
    // Spice Refinery effect.
    choices = t.currentChoices(game)
    if (choices.includes('Gain 2 Solari')) {
      t.choose(game, 'Gain 2 Solari')
    }
    // Deploy phase
    choices = t.currentChoices(game)
    const deploy = choices.find(c => c.startsWith('Deploy 0'))
    if (deploy) {
      t.choose(game, deploy)
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(garrisonBefore + 2)
    // Spy returned to supply (2 → 3).
    expect(dennis.spiesInSupply).toBe(3)
  })

  test('reveal: +1 Spice, +0 Persuasion (revealPersuasion: 0)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Rebel Supplier'] },
    })
    game.run()

    const spiceBefore = game.players.byName('dennis').getCounter('spice')

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('spice')).toBe(spiceBefore + 1)
    expect(dennis.getCounter('persuasion')).toBe(0)
  })

  test('reveal: 1 Sword contributes to strength when troops are deployed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Rebel Supplier'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // 1 troop * 2 + 1 sword * 1 = 3
    expect(dennis.strength).toBe(3)
  })
})
