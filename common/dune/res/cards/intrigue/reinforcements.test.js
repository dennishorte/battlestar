'use strict'

const t = require('../../../testutil.js')
const card = require('./reinforcements.js')

describe("reinforcements", () => {
  test('data', () => {
    expect(card.id).toBe("reinforcements")
    expect(card.name).toBe("Reinforcements")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })

  test('plot: paying for troops outside a Reveal turn does not offer to deploy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 3, troopsInGarrison: 0, troopsInSupply: 9, intrigue: ['Reinforcements'] },
    })
    game.run()

    // Played from the start-of-turn Plot Intrigue offer, before the
    // Agent/Reveal turn choice is even made.
    t.choose(game, 'Reinforcements')
    t.choose(game, 'Pay 3 Solari for +3 Troops')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(3)
    expect(dennis.solari).toBe(0)
    expect(game.state.conflict.deployedTroops.dennis || 0).toBe(0)
  })

  test('plot: deploying recruited troops during a Reveal turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: [], solari: 3, troopsInGarrison: 0, troopsInSupply: 9, intrigue: ['Reinforcements'] },
    })
    game.run()

    // Decline the start-of-turn Plot Intrigue offer so Reinforcements is
    // instead played after the Reveal Turn's strength has already been set.
    t.choose(game, 'Pass')
    while (game.waiting) {
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Acquire')) {
        t.choose(game, 'Pass')
      }
      else {
        break
      }
    }

    t.choose(game, 'Reinforcements')
    t.choose(game, 'Pay 3 Solari for +3 Troops')
    expect(t.currentChoices(game)).toContain('Deploy 2 troop(s) to the Conflict')
    t.choose(game, 'Deploy 2 troop(s) to the Conflict')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(1)
    expect(game.state.conflict.deployedTroops.dennis).toBe(2)
  })

  test('plot: passing on the Reveal turn deploy prompt leaves troops in garrison', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: [], solari: 3, troopsInGarrison: 0, troopsInSupply: 9, intrigue: ['Reinforcements'] },
    })
    game.run()

    t.choose(game, 'Pass')
    while (game.waiting) {
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Acquire')) {
        t.choose(game, 'Pass')
      }
      else {
        break
      }
    }

    t.choose(game, 'Reinforcements')
    t.choose(game, 'Pay 3 Solari for +3 Troops')
    t.choose(game, 'Deploy 0 troops')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(3)
    expect(game.state.conflict.deployedTroops.dennis || 0).toBe(0)
  })
})
