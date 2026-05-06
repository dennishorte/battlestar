'use strict'

const t = require('../../../testutil.js')
const card = require('./backed-by-choam.js')

describe("backed-by-choam", () => {
  test('data', () => {
    expect(card.id).toBe("backed-by-choam")
    expect(card.name).toBe("Backed by CHOAM")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasContracts).toBe(true)
  })

  test('plot: Lose 1 Influence -> +4 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Backed by CHOAM'],
        influence: { fremen: 2, emperor: 1 },
        solari: 0,
      },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Backed by CHOAM')
    t.choose(game, 'Backed by CHOAM')

    // lose-influence prompts which faction to lose
    const lossChoices = t.currentChoices(game)
    expect(lossChoices).toContain('fremen')
    expect(lossChoices).toContain('emperor')
    t.choose(game, 'fremen')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(4)
    expect(dennis.getInfluence('fremen')).toBe(1)

    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === 'Backed by CHOAM')).toBe(true)
  })

  test('combat: with 2+ completed contracts, +4 swords; card is discarded', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        // Bribery is a non-combat intrigue — keeps the intrigue zone non-empty
        // after Backed by CHOAM is discarded, so the combat intrigue loop
        // pauses again on dennis (giving us a chance to read the breakdown
        // before afterCombat() resets it).
        intrigue: ['Backed by CHOAM', 'Bribery'],
        contractsCompleted: 2,
      },
    })
    game.run()

    // pass plot intrigue at start of turn
    t.choose(game, 'Pass')
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // advance through reveal turns until combat intrigue prompt
    let safety = 60
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (title === 'Play Combat Intrigue card or Pass' && choices.includes('Backed by CHOAM')) {
        break
      }
      if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
      }
    }

    expect(t.currentChoices(game)).toContain('Backed by CHOAM')
    // sanity: dennis really has 2 completed contracts
    expect(game.zones.byId('dennis.contractsCompleted').cardlist().length).toBe(2)
    t.choose(game, 'Backed by CHOAM')

    // After playing, breakdown is captured before combat resolves and resets it.
    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label === 'Backed by CHOAM').reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(4)

    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === 'Backed by CHOAM')).toBe(true)
  })

  test('combat: with fewer than 2 contracts, no swords gained', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Backed by CHOAM', 'Bribery'],
        contractsCompleted: 1,
      },
    })
    game.run()

    t.choose(game, 'Pass')
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    let safety = 60
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0]?.title || ''
      if (title === 'Play Combat Intrigue card or Pass' && choices.includes('Backed by CHOAM')) {
        break
      }
      if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
      }
    }

    expect(t.currentChoices(game)).toContain('Backed by CHOAM')
    t.choose(game, 'Backed by CHOAM')

    const breakdown = game.state.conflict.strengthBreakdown.dennis || []
    const total = breakdown.filter(b => b.label === 'Backed by CHOAM').reduce((s, b) => s + b.amount, 0)
    expect(total).toBe(0)
  })
})
