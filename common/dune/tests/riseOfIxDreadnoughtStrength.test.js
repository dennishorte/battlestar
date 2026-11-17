const t = require('../testutil')
const rhombur = require('../res/leaders/PrinceRhomburVernius.js')

function putDreadnoughtInConflict(game, name, count) {
  game.testSetBreakpoint('after-round-start', (g) => {
    g.players.byName(name).setCounter('dreadnoughtsInConflict', count, { silent: true })
  })
}

describe('Rise of Ix dreadnought strength', () => {
  test('a dreadnought in the conflict is worth 3 and keeps swords', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Rebel Supplier'] },
    })
    putDreadnoughtInConflict(game, 'dennis', 1)
    game.run()

    t.choose(game, 'Reveal Turn')

    expect(game.players.byName('dennis').strength).toBe(4)
  })

  test('a dreadnought with no other unit is still in the fight', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: [] } })
    putDreadnoughtInConflict(game, 'dennis', 1)
    game.run()

    expect(game.players.byName('dennis').strength).toBe(3)
  })

  test('a dreadnought left in the garrison adds nothing', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: [] } })
    game.testSetBreakpoint('after-round-start', (g) => {
      g.players.byName('dennis').setCounter('dreadnoughtsInGarrison', 1, { silent: true })
    })
    game.run()

    expect(game.players.byName('dennis').strength).toBe(0)
  })

  test('Rhombur\'s dreadnought is worth 4', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: [] },
      leaders: { dennis: rhombur },
    })
    putDreadnoughtInConflict(game, 'dennis', 1)
    game.run()

    expect(game.players.byName('dennis').strength).toBe(4)
  })
})
