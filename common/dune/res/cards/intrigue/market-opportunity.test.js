'use strict'

const t = require('../../../testutil.js')
const card = require('./market-opportunity.js')

describe("market-opportunity", () => {
  test('data', () => {
    expect(card.id).toBe("market-opportunity")
    expect(card.name).toBe("Market Opportunity")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('Pay 2 Spice -> +5 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Market Opportunity'], solari: 0, spice: 2 },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Market Opportunity')
    t.choose(game, 'Market Opportunity')

    const choices = t.currentChoices(game)
    const cheapOption = choices.find(c => /Pay 2 Spice/i.test(c))
    expect(cheapOption).toBeDefined()
    t.choose(game, cheapOption)

    // Each branch parsed as its own cost-effect choice → nested Pay/Decline.
    t.choose(game, t.currentChoices(game).find(c => /Pay 2 Spice/i.test(c)))

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(5)
    expect(dennis.spice).toBe(0)

    // Log nesting: play header at indent 1, pay/gain effects at indent 2
    // (matches agent-turn structure so Dune's CSS shows nested effects).
    const log = game.log.getLog().filter(e => e.template)
    const playIdx = log.findIndex(e => /plays \{card\} \(Plot\)/.test(e.template))
    expect(playIdx).toBeGreaterThan(-1)
    expect(log[playIdx].indent).toBe(1)
    const pay = log.slice(playIdx + 1).find(e => /pays \{amount\}/.test(e.template))
    const gain = log.slice(playIdx + 1).find(e => /gains \{amount\}/.test(e.template))
    expect(pay?.indent).toBe(2)
    expect(gain?.indent).toBe(2)
  })

  test('Pay 5 Solari -> +5 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Market Opportunity'], solari: 5, spice: 0 },
    })
    game.run()

    t.choose(game, 'Market Opportunity')

    const choices = t.currentChoices(game)
    const spiceOption = choices.find(c => /Pay 5 Solari/i.test(c))
    expect(spiceOption).toBeDefined()
    t.choose(game, spiceOption)

    // Inner Pay/Decline.
    t.choose(game, t.currentChoices(game).find(c => /Pay 5 Solari/i.test(c)))

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(0)
    expect(dennis.spice).toBe(5)
  })

  test('picking the expensive branch when unaffordable resolves to nothing', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Market Opportunity'], solari: 2, spice: 0 },
    })
    game.run()

    t.choose(game, 'Market Opportunity')
    const outer = t.currentChoices(game)
    const expensive = outer.find(c => /Pay 5 Solari/i.test(c))
    t.choose(game, expensive)
    // Inner Pay/Decline filters Pay (cannot afford), only Decline → both
    // filtered to empty → no prompt, plot continues. Player resources
    // unchanged.
    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(2)
    expect(dennis.spice).toBe(0)
  })
})
