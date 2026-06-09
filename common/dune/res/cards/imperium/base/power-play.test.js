'use strict'

const t = require('../../../../testutil')
const card = require('./power-play.js')

describe("power-play", () => {
  test('data', () => {
    expect(card.id).toBe("power-play")
    expect(card.name).toBe("Power Play")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })

  test('agent ability: grants +2 influence on a faction space instead of +1', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Power Play'],
        influence: { emperor: 0 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Power Play')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Power Play')  // resolve card first

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('emperor')).toBe(2)
  })

  test('agent ability: trashes itself', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Power Play'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Power Play')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Power Play')

    const trashNames = game.zones.byId('common.trash').cardlist().map(c => c.name)
    expect(trashNames).toContain('Power Play')
  })
})
