'use strict'

const t = require('../../../../testutil')
const card = require('./imperial-spy.js')

describe("imperial-spy", () => {
  test('data', () => {
    expect(card.id).toBe("imperial-spy")
    expect(card.name).toBe("Imperial Spy")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })

  test('agent ability: trashes itself and draws an Intrigue card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Imperial Spy', 'Dagger'],
        intrigue: [],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Imperial Spy')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Spice Refinery (+1 Water)')

    const trashNames = game.zones.byId('common.trash').cardlist().map(c => c.name)
    expect(trashNames).toContain('Imperial Spy')
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })
})
